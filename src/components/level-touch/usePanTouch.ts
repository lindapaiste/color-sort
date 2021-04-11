import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {DeltaXY, PageLocation, XY} from "./types";
import {Animated, GestureResponderEvent, GestureResponderHandlers} from "react-native";

/**
 * callback handlers can take too long, causing a violation
 * to avoid this, the handler itself should just set the state and not do any calculation
 * calculations will be done by useEffect or animation listeners that detect changes made by the handler
 */

export type ReleaseLocation = PageLocation & {
    isSuccess: boolean;
}

export interface PanTouchReturn {
    /**
     * the location where the touch began
     */
    touchStart: PageLocation | null;
    /**
     * the current position of the finger on the screen during a drag movement
     */
    touchLocation: Animated.ValueXY;
    /**
     * the location where the finger was lifted
     * includes failed touches, but adds prop isSuccess to distinguish
     */
    touchRelease: ReleaseLocation | null;
    /**
     * whether the current or just ended touch is a drag rather than a tap
     */
    isDrag: boolean;
    /**
     * whether or not the touch is active right now
     */
    isTouching: boolean;
    /**
     * event handlers to be passed to a View component
     */
    handlers: GestureResponderHandlers;
}

export interface Props {
    tapMaxDuration?: number;
    moveMinDistance?: number;
}

export const usePanTouch = ({tapMaxDuration = 500, moveMinDistance = 3}: Props): PanTouchReturn => {


    console.log("usePanTouch re-rendered");
    /**
     * don't need to clear everything when can just see if touch is active or not
     */
    const [isTouching, setIsTouching] = useState(false);

    /**
     * set by onResponderStart
     * cleared by ??
     */
    const [touchStart, setTouchStart] = useState<PageLocation | null>(null);

    /**
     * set to false by onResponderStart
     * set to true by timeout or by touchLocation listener
     */
    const [isDrag, setIsDrag] = useState(false);

    useEffect(() => console.log({isDrag}), [isDrag]);

    /**
     * set by onMove event
     */
    const touchLocation = useRef(new Animated.ValueXY()).current;
    //TODO: learn about setOffset, flattenOffset, extractOffset functions on ValueXY


    /**
     * mainly saving this a way to distinguish between successfully released touches and cancelled or failed touches
     */
    const [touchRelease, setTouchRelease] = useState<ReleaseLocation | null>(null);

    /**
     * setTimeout will call a function after the duration has elapsed
     * unless it has been cleared/cancelled before then
     *
     * treat the touch as a drag if it exceeds the timeout,
     * and a touch if it ends before the timer
     *
     * also want to treat as a drag if significant movement occurs, even if quicker than timeout
     */
    const tapTimeOutRef = useRef<number | null>(null);
    let tapTimeoutHandler = useRef<number | null>(null).current;

    console.log("timeout", tapTimeOutRef.current)

    /**
     * previously defined functions clearTapTimeout and startTapTimeout with no parameters, but this leads to stale closure problem
     * can avoid by either:
     * 1) pass tapTimeoutHandler as param to the function
     * 2) manipulate directly -- have problems when called in quick succession by tap
     * 3) subscribe to isTouching
     */
    useEffect(() => {
        if (isTouching) {
            tapTimeOutRef.current = setTimeout(() => {
                setIsDrag(true);
                console.log("became drag because touch lasted longer than timeout duration")
            }, tapMaxDuration);
        } else {
            if (tapTimeOutRef.current !== null) {
                clearTimeout(tapTimeOutRef.current);
                console.log("cleared timeout");
            }
        }
        return () => {
            if (tapTimeOutRef.current !== null) {
                clearTimeout(tapTimeOutRef.current);
            }
        }
    }, [isTouching, tapMaxDuration]);

    /**
     * set an initial value of touchLocation when the touch starts
     * if displaying properly, this shouldn't matter because overlay shouldn't start until isDrag=true
     * but it has created issues
     */
    useEffect(() => {
        if (touchStart !== null) {
            const {pageX, pageY} = touchStart;
            touchLocation.setValue({x: pageX, y: pageY});
        }
    }, [touchStart, touchLocation]);


    const valueDelta = useCallback((value: XY): DeltaXY => {
        const start = touchStart === null ? {pageX: 0, pageY: 0} : touchStart;
        return ({
            dx: value.x - start.pageX,
            dy: value.y - start.pageY,
        });
    }, [touchStart]);

    const isExceededMoveThreshold = useCallback(({dx, dy}: DeltaXY): boolean => { //can pass PanResponderGestureState or can calculate dx & dy
        const distance = Math.sqrt(dx * dx - dy * dy);
        return distance > moveMinDistance;
    }, [moveMinDistance]);

    /**
     * on every move, see if drag threshold has been passed
     *
     * define the callback with dependencies on isDrag and touchStart
     * because writing the callback directly inside touchLocation.addListener led to isDrag changing value repeatedly
     */
    const listenerCallback = useCallback(({x, y}: XY) => {
            console.log({isDrag});
            if (!isDrag) {
                const delta = valueDelta({x, y});
                if (isExceededMoveThreshold(delta)) {
                    setIsDrag(true);
                    console.log(`became drag because movement of ${delta} exceeded threshold of ${moveMinDistance}`)
                }
            }
        },
        [isDrag, valueDelta, isExceededMoveThreshold, moveMinDistance]
    );
    const moveListener = touchLocation.addListener(() => {
    });//listenerCallback);

    //cleanup function only
    useEffect(() => {
        return () => {
            if (tapTimeOutRef.current !== null) {
                clearTimeout(tapTimeOutRef.current);
            }
            touchLocation.removeListener(moveListener);
        };
    }, [touchLocation, moveListener]);

    const onEndTouch = useCallback((e: GestureResponderEvent, isSuccess: boolean) => {
        setTouchRelease({
            ...e.nativeEvent,
            isSuccess,
        });
        setIsTouching(false);
    }, [setIsTouching, setTouchRelease]);

    const onStartTouch = useCallback((e: GestureResponderEvent) => {
        setTouchStart(e.nativeEvent);
        setIsTouching(true);
        setIsDrag(false);
    }, [setTouchStart, setIsTouching, setIsDrag]);

    /**
     * here, just return true always
     */
    const onStartShouldSetResponder = useCallback((e: GestureResponderEvent): boolean => {
        console.log("should start?");
        return true;
    }, []);

    const onResponderGrant = useCallback((e: GestureResponderEvent): void => {
        console.log("granted");
    }, []);

    /**
     * assume we are not dragging until told otherwise
     * create timer which automatically converts to a drag after the duration has passed
     */
    const onResponderStart = useCallback((e: GestureResponderEvent): void => {
        console.log("start");
        console.log(e.nativeEvent);
        onStartTouch(e);
    }, [onStartTouch]);
    /**
     * does two things:
     * 1. see if this has moved enough to count as a drag (but don't repeat if already considered dragging)
     *      ands updates isDrag accordingly
     *      (alternatively, could set the dragTranslate regardless and attach an event listener to see when distance exceeded)
     * 2. updated the dragTranslate Animated.ValueXY with the translation
     */
    const onResponderMove = useCallback((e: GestureResponderEvent): void => {
        console.log("move");
        Animated.event(
            [{pageX: touchLocation.x, pageY: touchLocation.y}]
        )(e.nativeEvent);
        listenerCallback({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY});
    }, [listenerCallback, touchLocation]);
    /**
     * called on successful lift up of finger
     */
    const onResponderRelease = useCallback((e: GestureResponderEvent): void => {
        console.log("release");
        onEndTouch(e, true);
    }, [onEndTouch]);
    /**
     * gets called when some other element becomes the responder
     */
    const onResponderTerminate = useCallback((e: GestureResponderEvent): void => {
        console.log("terminate");
        onEndTouch(e, false);
    }, [onEndTouch]);
    /**
     * honestly not sure when called
     */
    const onResponderEnd = useCallback((e: GestureResponderEvent): void => {
        console.log("end");
        onEndTouch(e, false);
    }, [onEndTouch]);

    const handlers = useMemo(() => ({
        onStartShouldSetResponder,
        onResponderStart,
        onResponderMove,
        onResponderRelease,
        onResponderTerminate,
        onResponderEnd,
        onResponderGrant,
    }), [onStartShouldSetResponder,
        onResponderStart,
        onResponderMove,
        onResponderRelease,
        onResponderTerminate,
        onResponderEnd,
        onResponderGrant,
    ]);

    return useMemo(() => ({
        handlers,
        touchLocation,
        touchRelease,
        touchStart,
        isDrag,
        isTouching
    }), [handlers,
        touchLocation,
        touchRelease,
        touchStart,
        isDrag,
        isTouching]);
};
