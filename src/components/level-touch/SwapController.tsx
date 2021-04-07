import React, {ComponentType, PropsWithChildren, useCallback, useEffect, useRef, useState} from "react";
import {Animated, View, ViewProps} from "react-native";
import {SlotArray} from "./types";
import {useSlotRegistry} from "./useSlotRegistry";
import {usePanTouch} from "./usePanTouch";
import {Portal} from "react-native-paper";
import {CompleteSlot, ExecuteSwap, OverlayProps, OverlayType, PageLocation} from "./types";
import {ControllerContext} from "./ControllerContext";

/**
 * use slot ids rather than ball ids because when looking up by location it is easier to find the slot than the ball
 */

interface Props {
    executeSwap: ExecuteSwap;
    findTarget: (x: number, y: number, slots: SlotArray) => CompleteSlot | null;
    RenderOverlayBall: ComponentType<OverlayProps>;
}

/**
 * SwapController knows:
 *
 * internally:
 * the ids and positions of all slots it controls
 * the current touch
 *
 * from props:
 * how to find the slot at a given location (so it can deal with circles, ignore disabled, etc)
 * how to dispatch a swap
 * how to render the dragging or swapping overlays
 *
 * it wraps its children in a context provider so that they can access the swap/touch/selection state
 *
 * now using Portal to place overlays ate the root, so no longer need to know containerOffset
 */
export const SwapController = ({executeSwap, findTarget, RenderOverlayBall, ...props}: PropsWithChildren<Props & ViewProps>) => {

    const {slotAreas, registerSlot} = useSlotRegistry();

    /**
     * save the pressed slot, which is awaiting a second tap
     */
    const [pressed, setPressed] = useState<CompleteSlot | null>(null);

    /**
     * for a tap pair, both balls are treated the same so a tuple of 2 ids is fine as order doesn't matter
     * for a drag swap, target vs. pressed matters because need to know which to apply the translate to
     */
    const [overlay, setOverlay] = useState<Array<OverlayProps>>([]);

    const swapEffectTimer = useRef(new Animated.Value(0)).current;

    /**
     * helper for generating overlay ball props for each of the swap pair
     */
    const swapProps = useCallback( (slot: CompleteSlot, targetSlot: CompleteSlot, isPrimary: boolean, overlayType: OverlayType): OverlayProps => ({
        slot: slot.slot,
        start: slot,
        end: targetSlot,
        timer: swapEffectTimer,
        isPrimary,
        overlayType,
    }), [swapEffectTimer]);

    /**
     * handle taps differently depending on whether it is the first or the second
     */
    const onTapSlot = (slot: CompleteSlot | null) => {
        /**
         * activate slot on first press
         */
        if (pressed === null) {
            setPressed(slot);
        }
        /**
         * deactivate on repeat press of same slot
         * or on outside click
         */
        else if ( slot === null || pressed.slot === slot.slot ) {
            setPressed(null);
        }
        /**
         * swap on second press
         */
        else {
            setOverlay([
                //move this slot to first pressed position
                swapProps(slot, pressed, false, OverlayType.TAP_SWAP),
                //move pressed slot to this position
                swapProps(pressed, slot, true, OverlayType.TAP_SWAP),
            ]);
        }
    };

    /**
     * clear pressed ball on overlay (swap or drag)
     */
    useEffect( () => {
        setPressed(null);
    }, [overlay]);

    /**
     * automatically begins the swapEffectTimer when a swap pair is set
     * and executes the swap when the timer is finished
     *
     * resets the timer to 0 when swap pair is reset to null
     */
    useEffect(() => {
        if ( overlay.length === 2 ) { //do I also need to check overlayType?
            const [a, b] = overlay;
            Animated.timing(swapEffectTimer, {
                toValue: 1,
                duration: 500
            }).start(() => {
                executeSwap(a.slot, b.slot);
                setOverlay([]);
            });
        } else {
            swapEffectTimer.setValue(0);
        }
    }, [overlay]);

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
     * callback handlers can take too long, causing a violation
     * to avoid this, the handler itself should just set the state and not do any calculation
     * calculations will be done by useEffect or animation listeners that detect changes made by the handler
     */
    const {touchStart, touchRelease, touchLocation, isTouching, isDrag, handlers} = usePanTouch({});

    const isDragging = isDrag && isTouching;

    /**
     * use responderTarget instead of pressed to avoid confusion around handling second touches
     *
     * set by useEffect on touchStart
     * cleared by start of swap or end of returnToStart
     */
    const [responderTarget, setResponderTarget] = useState<CompleteSlot | null>(null);

    const isBallTouch = touchStart !== null && responderTarget !== null;

    /**
     * initially set to the target ball by responderTarget effect
     * set by touchLocation listener
     * cleared by ??
     */
    const [hoverSlot, setHoverSlot] = useState<CompleteSlot | null>(null);



    /**
     * find the target at the start of every touch
     */
    useEffect(() => {
        if (touchStart !== null) {
            const target = findTarget(touchStart.pageX, touchStart.pageY, slotAreas);
            //console.log(touchStart);
            //console.log("target", target);
            setResponderTarget(target);
        }
    }, [touchStart]);

    /**
     * begin with hover as the responderTarget
     */
    useEffect(() => {
        setHoverSlot(responderTarget);
    }, [responderTarget]);

    /**
     * find out which, if any, slot is being hovered over
     * for better performance, start by checking current target before checking others
     */

    //const callbackFindHovering =


    /**
     * sets the drag overlay ball while dragging
     * never removes it, but expect it to be replaced via returnToStart or swap
     */
    useEffect( () => {
        if ( isDrag && responderTarget !== null && touchStart !== null ) {
            setOverlay([{
                slot: responderTarget.slot,
                pageX: Animated.add(touchLocation.x,  responderTarget.pageX - touchStart.pageX),
                pageY: Animated.add(touchLocation.y, responderTarget.pageY - touchStart.pageY),
                overlayType: OverlayType.DRAGGING,
                isPrimary: true,
            }]);
        }
    }, [responderTarget, isDrag]);

    /**
     * handle drag release or abort
     */
    useEffect(() => {
        if (touchRelease !== null) {
            if ( touchRelease.isSuccess ) {
                releaseAtLocation(touchRelease);
            } else {
                returnToStart(touchRelease);
            }
        }
    }, [touchRelease]);

    const returnEffectTimer = useRef(new Animated.Value(0)).current;

    /**
     * sets the ball as an overlay for the duration of the return effect and then removes it
     */
    const returnToStart = (currentLocation: PageLocation ) => {
        if ( responderTarget === null ) {
            return;
        }
        setOverlay([
            {
                slot: responderTarget.slot,
                start: slotTranslatedLocation(currentLocation, responderTarget),
                end: responderTarget,
                timer: returnEffectTimer,
                isPrimary: true,
                overlayType: OverlayType.RETURNING,
            }
        ]);
        Animated.spring(returnEffectTimer, {
            toValue: 1,
        }).start(() => {
            setOverlay([]);
            returnEffectTimer.setValue(0);
        })
    };

    /**
     * takes the current touch position and the start touch position and applies
     * to the slot location to get the slot pageX/Y corresponding to the touch
     *
     * passing responderTarget through props to ensure that it isn't null
     * because this will already have been checked in user
     */
    const slotTranslatedLocation = (currentTouch: PageLocation, targetSlot: PageLocation): PageLocation => {
        if ( touchStart === null ) {
            console.warn("null touch start location");
            return currentTouch;
        }
        const dx = currentTouch.pageX - touchStart.pageX;
        const dy = currentTouch.pageY - touchStart.pageY;
        return {
            pageX: targetSlot.pageX + dx,
            pageY: targetSlot.pageY + dy,
        }
    };

    /**
     * when releasing from a drag, need to find the target that it was released to
     * if there is a target, begin the swap between the gesture slot and the target slot
     * if not, return the ball to its initial position
     *
     * when releasing from tap, will process as either first or second tap based on state of pressed
     */
    const releaseAtLocation = ({pageX, pageY}: PageLocation): void => {
        console.log("release");

        //tap
        if (! isDrag ) {
            /**
             * can assume that the release target is the same as the gesture target because if it had moved
             * it would already be considered not a tap
             * however there is a chance that responderTarget is still being computed
             */
            onTapSlot(responderTarget);
            return;
        }


        if (touchStart === null) {
            console.error("releasing from touch without setting start location");
            return;
        }

        if (responderTarget === null) {
            console.error("releasing from responder without setting responderTarget");
            return;
        }

        //drag
        if (isDrag) {



            const target = findTarget(pageX, pageY, slotAreas);
            /**
             * return to start if not releasing at a valid slot, or if releasing at the same slot
             */
            if (target === null || target.slot == responderTarget.slot ) {
                returnToStart({pageX, pageY});
            }
            /**
             * swap move is not symmetric
             * the dragged balls starts from its current/translated position rather than the touch start position
             * touchLocation will be in the middle of the ball, but need to pass the top left corner of the slot
             */
            else {
                setOverlay([
                    {
                        ...swapProps( responderTarget, target,true, OverlayType.DRAG_SWAP ),
                        //override the swap start position to the current position
                        start: slotTranslatedLocation({pageX, pageY}, responderTarget),
                    },
                    swapProps( target, responderTarget,false, OverlayType.DRAG_SWAP )
                ])
            }
        }
    };


    /**
     * defaults to point (0,0) in unexpected case that the slot is undefined
     */
    const slotLocation = (slot: number): PageLocation => {
        const location = slotAreas[slot];
        if (!location) {
            console.error("cannot find location for slot # " + slot);
            return {pageY: 0, pageX: 0};
        }
        return location;
    };

    const isSwapSlot = (slot: number): boolean => {
        return overlay.some(o => o.slot === slot && (o.overlayType === OverlayType.TAP_SWAP || o.overlayType === OverlayType.DRAG_SWAP ));
    };

    const isDraggingSlot = (slot: number): boolean => {
        return isDragging && responderTarget !== null && responderTarget.slot === slot;
    };

    const isPressedSlot = (slot: number): boolean => {
        return pressed !== null && pressed.slot === slot;
    };

    const getSlotProps = (slot: number) => ({
        isSwapping: isSwapSlot(slot),
        isPressed: isPressedSlot(slot),
        isDragging: isDraggingSlot(slot),
        isOverlay: overlay.some( o => o.slot === slot ),
    });

    useEffect(() => {
        console.log(overlay);
    }, [overlay]);


    return (
        <ControllerContext.Provider
            value={{
                slots: slotAreas,
                registerSlot,
                getSlotProps,
            }}
        >
            <View
                {...props} //includes children
                {...handlers}
            />
            <Portal>
                {overlay.map(
                    (overlayProps) => (
                        <RenderOverlayBall
                            key={overlayProps.slot}
                            {...overlayProps}
                        />
                    )
                )}
            </Portal>
        </ControllerContext.Provider>
    );
};
