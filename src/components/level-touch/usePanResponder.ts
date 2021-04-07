import {useEffect, useRef, useState} from "react";
import {DeltaXY} from "./types";
import {
    Animated,
    GestureResponderEvent,
    GestureResponderHandlers,
    NativeTouchEvent,
    PanResponder,
    PanResponderGestureState
} from "react-native";
import {I_Point} from "../animated/DragOrTap";

/**
 * by using react native PanResponder class, can easily include more data in the interface
 * ie. not just location but also delta
 * otherwise it's basically the same
 */

export interface PanTouchReturn {
    /**
     * the location where the touch began
     */
    touchStart: NativeTouchEvent | null;
    /**
     * the current position of the finger on the screen during a drag movement
     */
    touchLocation: Animated.ValueXY;
    /**
     * the location where the finger was lifted on successful completion of touch
     */
    touchRelease: (NativeTouchEvent & PanResponderGestureState) | null;
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
    const [touchStart, setTouchStart] = useState<NativeTouchEvent | null>(null);

    /**
     * set to false by onResponderStart
     * set to true by timeout or by touchLocation listener
     */
    const [isDrag, setIsDrag] = useState(false);

    /**
     * set by onMove event
     */
    const touchLocation = useRef(new Animated.ValueXY()).current;
    //TODO: learn about setOffset, flattenOffset, extractOffset functions on ValueXY


    /**
     * mainly saving this a way to distinguish between successfully released touches and cancelled or failed touches
     */
    const [touchRelease, setTouchRelease] = useState<(NativeTouchEvent & PanResponderGestureState) | null>(null);

    /**
     * setTimeout will call a function after the duration has elapsed
     * unless it has been cleared/cancelled before then
     *
     * treat the touch as a drag if it exceeds the timeout,
     * and a touch if it ends before the timer
     *
     * also want to treat as a drag if significant movement occurs, even if quicker than timeout
     */
    let tapTimeoutHandler: number | null = null;

    const clearTapTimeout = () => {
        if (tapTimeoutHandler !== null) {
            clearTimeout(tapTimeoutHandler);
        }
    };

    const startTapTimeout = () => {
        tapTimeoutHandler = setTimeout(() => {
            setIsDrag(true);
        }, tapMaxDuration);
    };

    const onUnmount = (): void => {
        clearTapTimeout();
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
     */
    const moveListener = touchLocation.addListener(({x, y}) => {
        if (!isDrag) {
            const delta = valueDelta({x, y});
            if (isExceededMoveThreshold(delta)) {
                setIsDrag(true);
            }
        }
    });

    const onEndTouch = () => {
        setIsTouching(false);
        clearTapTimeout();
    };

    const onStartTouch = (e: GestureResponderEvent) => {
        setTouchStart(e.nativeEvent);
        setIsTouching(true);
        startTapTimeout();
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
    };
    /**
     * called on successful lift up of finger
     */
    const onResponderRelease = (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
        console.log("release");
        onEndTouch();
        setTouchRelease({...e.nativeEvent, ...gestureState});
    };
    /**
     * gets called when some other element becomes the responder
     */
    const onResponderTerminate = (): void => {
        console.log("terminate");
        onEndTouch();
    };
    /**
     * honestly not sure when called
     */
    const onResponderEnd = (): void => {
        console.log("end");
        onEndTouch();
    };


    const responder = useRef(PanResponder.create({
        onPanResponderEnd: onResponderEnd,
        onPanResponderTerminate: onResponderTerminate,
        onPanResponderRelease: onResponderRelease,
        onPanResponderMove: onResponderMove,
        onStartShouldSetPanResponder: onStartShouldSetResponder,
        onPanResponderStart: onResponderStart,
        onPanResponderGrant: onResponderGrant,
    })).current;

    return {
        handlers: responder.panHandlers,
        touchLocation,
        touchRelease,
        touchStart,
        isDrag,
        isTouching,
    }
};
