import {useCallback, useEffect, useRef, useState} from "react";
import {DeltaXY, PageLocation} from "./types";
import {Animated, GestureResponderEvent, GestureResponderHandlers} from "react-native";
import {I_Point} from "../animated/DragOrTap";

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
    let tapTimeoutHandler = useRef<number | null>(null).current;

    /**
     * previously defined functions clearTapTimeout and startTapTimeout with no parameters, but this leads to stale closure problem
     * can avoid by either:
     * 1) pass tapTimeoutHandler as param to the function
     * 2) manipulate directly -- have problems when called in quick succession by tap
     * 3) subscribe to isTouching
     */
    useEffect(() => {
        if (isTouching) {
            tapTimeoutHandler = setTimeout(() => {
                setIsDrag(true);
                console.log("became drag because touch lasted longer than timeout duration")
            }, tapMaxDuration);
        } else {
            if (tapTimeoutHandler !== null) {
                clearTimeout(tapTimeoutHandler);
                console.log("cleared timeout");
            }
        }
        return () => {
            if (tapTimeoutHandler !== null) {
                clearTimeout(tapTimeoutHandler);
            }
        }
    }, [isTouching]);

    /**
     * set an initial value of touchLocation when the touch starts
     * if displaying properly, this shouldn't matter because overlay shouldn't start until isDrag=true
     * but it has created issues
     */
    useEffect( () => {
        if ( touchStart !== null ) {
            const {pageX, pageY} = touchStart;
            touchLocation.setValue({x: pageX, y: pageY});
        }
    }, [touchStart]);

    const onUnmount = (): void => {
        if (tapTimeoutHandler !== null) {
            clearTimeout(tapTimeoutHandler);
        }
        touchLocation.removeListener(moveListener);
    };

    //cleanup function only
    useEffect(() => {
        return onUnmount;
    }, []);


    const valueDelta = (value: I_Point): DeltaXY => {
        const start = touchStart === null ? {pageX: 0, pageY: 0} : touchStart;
        return ({
            dx: value.x - start.pageX,
            dy: value.y - start.pageY,
        });
    };

    const isExceededMoveThreshold = ({dx, dy}: DeltaXY): boolean => { //can pass PanResponderGestureState or can calculate dx & dy
        const distance = Math.sqrt(dx * dx - dy * dy);
        return distance > moveMinDistance;
    };

    /**
     * on every move, see if drag threshold has been passed
     *
     * define the callback with dependencies on isDrag and touchStart
     * because writing the callback directly inside touchLocation.addListener led to isDrag changing value repeatedly
     */
    const listenerCallback = useCallback( ({x, y}: I_Point) => {
        console.log({isDrag});
        if (!isDrag) {
            const delta = valueDelta({x, y});
            if (isExceededMoveThreshold(delta)) {
                setIsDrag(true);
                console.log(`became drag because movement of ${delta} exceeded threshold of ${moveMinDistance}`)
            }
        }
    },
        [isDrag, touchStart]
    );
    const moveListener = touchLocation.addListener(() => {});//listenerCallback);

    const onEndTouch = (e: GestureResponderEvent, isSuccess: boolean) => {
        setTouchRelease({
            ...e.nativeEvent,
            isSuccess,
        });
        setIsTouching(false);
    };

    const onStartTouch = (e: GestureResponderEvent) => {
        setTouchStart(e.nativeEvent);
        setIsTouching(true);
        setIsDrag(false);
    };

    /**
     * here, just return true always
     */
    const onStartShouldSetResponder = (e: GestureResponderEvent): boolean => {
        console.log("should start?");
        return true;
    };

    const onResponderGrant = (e: GestureResponderEvent): void => {
        console.log("granted");
    };

    /**
     * assume we are not dragging until told otherwise
     * create timer which automatically converts to a drag after the duration has passed
     */
    const onResponderStart = (e: GestureResponderEvent): void => {
        console.log("start");
        console.log(e.nativeEvent);
        onStartTouch(e);
    };
    /**
     * does two things:
     * 1. see if this has moved enough to count as a drag (but don't repeat if already considered dragging)
     *      ands updates isDrag accordingly
     *      (alternatively, could set the dragTranslate regardless and attach an event listener to see when distance exceeded)
     * 2. updated the dragTranslate Animated.ValueXY with the translation
     */
    const onResponderMove = (e: GestureResponderEvent): void => {
        console.log("move");
        Animated.event(
            [{pageX: touchLocation.x, pageY: touchLocation.y}]
        )(e.nativeEvent);
        listenerCallback({x: e.nativeEvent.pageX, y: e.nativeEvent.pageY});
    };
    /**
     * called on successful lift up of finger
     */
    const onResponderRelease = (e: GestureResponderEvent): void => {
        console.log("release");
        onEndTouch(e, true);
    };
    /**
     * gets called when some other element becomes the responder
     */
    const onResponderTerminate = (e: GestureResponderEvent): void => {
        console.log("terminate");
        onEndTouch(e, false);
    };
    /**
     * honestly not sure when called
     */
    const onResponderEnd = (e: GestureResponderEvent): void => {
        console.log("end");
        onEndTouch(e, false);
    };


    return {
        handlers: {
            onStartShouldSetResponder,
            onResponderStart,
            onResponderMove,
            onResponderRelease,
            onResponderTerminate,
            onResponderEnd,
            onResponderGrant,
        },
        touchLocation,
        touchRelease,
        touchStart,
        isDrag,
        isTouching,
    }
};
