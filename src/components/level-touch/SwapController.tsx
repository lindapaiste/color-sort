import React, {ComponentType, PropsWithChildren, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {Animated, View, ViewProps} from "react-native";
import {CompleteSlot, ExecuteSwap, OverlayData, OverlayProps, OverlayType, SlotArray, XY} from "./types";
import {Portal} from "react-native-paper";
import {useSelector} from "../../state";
import {
    selectHoveredSlotId, selectIsDragging,
    selectOverlayData,
    selectPressedSlotId,
    selectSlotDataMap,
    selectTouchedSlotId, selectTouchStart
} from "../../state/slotSwap/selectors";
import {hoveredOverSlot} from "../../state/slotSwap/reducer";
import {useReduxPanResponder} from "./useReduxPanResponder";
import {useDispatch} from "react-redux";

/**
 * use slot ids rather than ball ids because when looking up by location it is easier to find the slot than the ball
 */

interface Props {
    executeSwap: ExecuteSwap;
    findTarget: (x: number, y: number, slots: SlotArray) => CompleteSlot | null;
    RenderOverlayBall: ComponentType<OverlayProps>;
}


/**
 * what happens when tap and drag are mixed?
 * looked at I Love Hue Too
 * one ball is active, blinking and awaiting a target
 * touch another ball and hold it -- nothing happens until release
 * drag from another ball to off area -- cancels active ball
 * it never "picks up" the ball at the start location
 * if the finger goes from one ball to another, it will swap the original blinking ball with where it was released
 */

/**
 * wrap in a try/catch to avoid errors on Animated.ValueXY which occur when the removed listener doesn't exist
 */
export const safeRemoveListener = (animation: Animated.Value | Animated.ValueXY, listenerId: string) => {
    try {
        animation.removeListener(listenerId);
    } catch (e) {

    }
}

/**
 * refactored so that all stateful logic is in Redux
 * know the SwapController is responsible for:
 * running animations
 * rendering overlay
 * dispatching actions
 * passing gesture handlers to View
 *
 * SwapController knows:
 *
 * internally:
 * the current touch position
 *
 * from props:
 * how to find the slot at a given location (so it can deal with circles, ignore disabled, etc)
 * how to dispatch a swap
 * how to render the dragging or swapping overlays
 *
 * from redux:
 * swap overlay data
 * pressed slot id
 * the locations of all slots
 *
 * it wraps its children in a context provider so that they can access the swap/touch/selection state
 *
 * now using Portal to place overlays at the root, so no longer need to know containerOffset
 */
export const SwapController = ({
                                   executeSwap,
                                   findTarget,
                                   RenderOverlayBall,
                                   ...props
                               }: PropsWithChildren<Props & ViewProps>) => {

    console.log("SwapController re-rendered");

    const dispatch = useDispatch();

    const slotAreas = useSelector(selectSlotDataMap);

    const pressedSlotId = useSelector(selectPressedSlotId);

    const touchedSlotId = useSelector(selectTouchedSlotId);

    const hoverSlotId = useSelector(selectHoveredSlotId);

    const overlay = useSelector(selectOverlayData);

    const touchStart = useSelector(selectTouchStart);

    const isDragging = useSelector(selectIsDragging);

    const swapEffectTimer = useRef(new Animated.Value(0)).current;


    /**
     * Animated Value stores the current touch position
     * set by onMove event
     */
    const touchAnimation = useRef(new Animated.ValueXY()).current;
    //TODO: learn about setOffset, flattenOffset, extractOffset functions on ValueXY

    /**
     * clear pressed ball on overlay (swap or drag)
     */
    useEffect(() => {
        //TODO: check that I am doing this
        //setPressed(null);
    }, [overlay]);

    /**
     * automatically begins the swapEffectTimer when a swap pair is set
     * and executes the swap when the timer is finished
     *
     * resets the timer to 0 when swap pair is reset to null
     */
    useEffect(() => {
        if (overlay) {
            const callback = () => {
                swapEffectTimer.setValue(0);
                // do a swap if the overlay is a pair, or nothing if single (return to start)
                if (overlay.length === 2) {
                    const [a, b] = overlay;
                    executeSwap(a.slot, b.slot);
                }
            };
            Animated.timing(swapEffectTimer, {
                toValue: 1,
                // should duration vary by effect?
                duration: 500
            }).start(callback);
        } else {
            swapEffectTimer.setValue(0);
        }
    }, [overlay]);


    /**
     * callback handlers can take too long, causing a violation
     * to avoid this, the handler itself should just set the state and not do any calculation
     * calculations will be done by useEffect or animation listeners that detect changes made by the handler
     */
    const responder = useReduxPanResponder({touchLocation: touchAnimation});

    const handlers = responder.panHandlers;

    /**
     * find out which, if any, slot is being hovered over
     * TODO: for better performance, start by checking current target before checking others
     * want to dispatch only if different than the current
     * also want to clear
     * could add a listener to the animated value directly, but would need to update in response to changes of the current hoveringOver
     * could save position to state and run an effect on the position
     */
    const listenerRef = useRef<string>();

    const listenerCallback = useCallback( ({x, y}: XY) => {
        const target = findTarget(x, y, slotAreas);
        if ( target ) console.log("target", target, target.slot,  target && target.slot !== touchedSlotId, "current hover", hoverSlotId);
        const hoverValue = ( target && target.slot !== touchedSlotId ) ? target.slot : undefined;
        if ( hoverValue !== hoverSlotId ) {
            console.log("validated target", hoverValue);
            dispatch(hoveredOverSlot(hoverValue));
        }
    }, [slotAreas, touchedSlotId, hoverSlotId]);


    const callbackRef = useRef(listenerCallback);

    useEffect(() => {
        callbackRef.current = listenerCallback;
    }, [listenerCallback]);

    useEffect(() => {

        const remove = () => {
            //console.warn("removing", listenerRef.current, touchAnimation, touchAnimation._listeners[listenerRef.current]);
            if ( listenerRef.current ) {
                safeRemoveListener(touchAnimation, listenerRef.current);
            }
        }

        listenerRef.current = touchAnimation.addListener((xy) => {
            callbackRef.current(xy);
        });

        return remove;
        // TODO: expo update to get support for this.
        //return () => touchAnimation.removeAllListeners();
    }, []);


    //console.log("current active listeners outside effect");
    //console.log(touchAnimation._listeners);
    /**
     * sets the drag overlay ball while dragging
     * never removes it, but expect it to be replaced via returnToStart or swap
     */
    const dragOverlay: OverlayProps | undefined = useMemo(() => {
        if ( isDragging && touchedSlotId && touchStart ) {
            return ({
                slot: touchedSlotId,
                pageX: Animated.add(touchAnimation.x, touchStart.slotPageX - touchStart.pageX),
                pageY: Animated.add(touchAnimation.y, touchStart.slotPageY - touchStart.pageY),
                overlayType: OverlayType.DRAGGING,
                isPrimary: true,
            })
        }
    }, [isDragging, touchedSlotId]);

    useEffect(() => {
        console.log(overlay);
    }, [overlay]);


    return (
        <>
            <View
                {...props} //includes children
                {...handlers}
            />
            <Portal>
                {overlay?.map(
                    (overlayProps) => (
                        <RenderOverlayBall
                            key={overlayProps.slot}
                            {...overlayProps}
                            timer={swapEffectTimer}
                        />
                    )
                )}
                {dragOverlay !== undefined && (
                    <RenderOverlayBall
                        {...dragOverlay}
                    />
                )}
            </Portal>
        </>
    );
};
