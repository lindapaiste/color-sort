import {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {DeltaXY, XY} from "./types";
import {
    Animated,
    GestureResponderEvent,
    GestureResponderHandlers,
    NativeTouchEvent,
    PanResponder,
    PanResponderGestureState, PanResponderInstance
} from "react-native";
import {useDispatch} from "react-redux";
import {useSelector} from "../../state";
import {MOVE_MIN_DISTANCE} from "./constants";
import {touchRejected, touchReleased, touchStarted, touchBecameDrag} from "../../state/slotSwap/reducer";
import {isExceededMoveThreshold} from "./calc";
/**
 * hook connects data in Redux state with PanResponder callbacks
 *
 * by using react native PanResponder class, can easily include more data in the interface
 * ie. not just location but also delta
 *
 * removing tapTimeout and just determining tap vs. drag based on amount of movement
 */

export interface Props {
    touchLocation: Animated.ValueXY;
    moveMinDistance?: number;
}

/**
 * need to remove non-serializable values from event before dispatching
 */
const reduxSafeEvent = (e: GestureResponderEvent) => {
    const {pageX, pageY, timestamp} = e.nativeEvent;
    return {pageX, pageY, timestamp};
}


export const useReduxPanResponder = ({moveMinDistance = MOVE_MIN_DISTANCE, touchLocation}: Props): PanResponderInstance => {

    const dispatch = useDispatch();

    /**
     * set to false by onResponderStart
     * set to true by touchLocation listener
     */
    const isDrag = useSelector(state => state.slotSwap.touch.isDrag);

    return useMemo( () => {
        return PanResponder.create({
            /**
             * seems to be called right before release, so don't do anything here
             */
            onPanResponderEnd: (): void => {
                console.log("end");
            },
            /**
             * gets called when some other element becomes the responder
             */
            onPanResponderTerminate: (): void => {
                console.log("terminate");
                dispatch(touchRejected());
            },
            /**
             * called on successful lift up of finger
             */
            onPanResponderRelease: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                console.log("release");
                //TODO: pass delta
                dispatch(touchReleased(reduxSafeEvent(e)))
            },/**
             * does two things:
             * 1. see if this has moved enough to count as a drag (but don't repeat if already considered dragging)
             *      ands updates isDrag accordingly
             *      (alternatively, could set the dragTranslate regardless and attach an event listener to see when distance exceeded)
             * 2. updated the dragTranslate Animated.ValueXY with the translation
             */
            onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                console.log("move");
                if ( ! isDrag ) {
                    if (isExceededMoveThreshold(gestureState, moveMinDistance)) {
                        dispatch(touchBecameDrag());
                    }
                }
                Animated.event(
                    [{pageX: touchLocation.x, pageY: touchLocation.y}]
                )(e.nativeEvent);
            },
                /**
                 * here, just return true always
                 */
                onStartShouldSetPanResponder: (e: GestureResponderEvent): boolean => {
                    console.log("should start?");
                    return true;
                },
                /**
                 * assume we are not dragging until told otherwise
                 * create timer which automatically converts to a drag after the duration has passed
                 */
                onPanResponderStart: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                    console.log("start");
                    dispatch(touchStarted(reduxSafeEvent(e)));
                },
            onPanResponderGrant: (e: GestureResponderEvent): void => {
                console.log("granted");
            },
        });
    }, [dispatch, isDrag, touchLocation, moveMinDistance]);
};
