import React, {
    ComponentType,
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState
} from "react";
import {Animated, GestureResponderEvent, PanResponder, PanResponderGestureState, View} from "react-native";
import {DeltaXY, Offset, RegisterFunction, SlotArray} from "../types";
import {colorString, createRandom} from "../../../util/color-util";
import {range} from "lodash";
import {RBallParent} from "../../animated/AnimatedBall";
import {swapIndexes} from "../../../util/array-edit";
import {GestureEvents, I_Point} from "../../animated/DragOrTap";
import {TimedLocation} from "../types";
import {AnimatedLocation} from "../types";
import {findIsInCircle} from "../useFindTarget";
import {RRegisteredSlot} from "../RegisteredSlot";
import {useComponentLocation} from "../useComponentLocation";
import {ROverlayPosition} from "../OverlayPosition";
import {RBasicBall} from "../BasicBall";
import {useSlotRegistry} from "../useSlotRegistry";

/**
 * want to see what happens if I store just the slot id for pressed/dragging/etc and not the whole location
 *
 * if this is the case then the components which render the swap and drag effects will access redux to get the swap contents
 */

//TODO: swap has wrong offset because of inconsistency between ball offset and slot offset

export interface MoveProps {
    slot: number;
    top: number;
    left: number;
    color?: string;
}

type SwapPair = [MoveProps, MoveProps];

type ExecuteSwap = (a: number, b: number) => void;

export const Tester = () => {

    const diameter = 50;
    const slotSize = 60;

    const balls = useRef(range(0, 30).map(createRandom).map(colorString));

    const [slots, setSlots] = useState(balls.current.map((_, i) => i));

    const getBallColor = (id: number) => balls.current[id];

    const getSlotColor = (slot: number) => {
        const ballId = slots[slot];
        return getBallColor(ballId);
    };

    const executeSwap: ExecuteSwap = (a, b) => {
        setSlots(swapIndexes(slots, a, b));
    };

    const findTarget = useCallback(
        (x: number, y: number, slots: SlotArray) => findIsInCircle(slotSize, diameter)(slots)(x, y),
        [slotSize, diameter]
    );

    return (
        <>
            <View
                style={{
                    marginLeft: 50,
                }}
            >
                <SwapController
                    executeSwap={executeSwap}
                    findTarget={findTarget}
                    RenderOverlayBall={props => (
                        <ROverlayPosition {...props}>
                            <RBasicBall
                                color={getSlotColor(props.slot)}
                                slotSize={slotSize}
                                diameter={diameter}
                            />
                        </ROverlayPosition>
                    )}
                >
                    <View
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                        }}
                    >
                        {slots.map((ballId, slot) => (
                            <TesterBall
                                key={slot}
                                color={getBallColor(ballId)}
                                diameter={diameter}
                                slotSize={slotSize}
                                slot={slot}
                            />
                        ))}
                    </View>
                </SwapController>
            </View>
        </>
    )

};

const TesterBall = ({slotSize, diameter, color, slot}: { slotSize: number, diameter: number, color: string, slot: number }) => {
    const {isSwapping, isPressed, isDragging} = useGetSlotProps()(slot);
    return (
        <RRegisteredSlot
            slotSize={slotSize}
            register={useRegisterSlot()}
            slot={slot}
        >
            <RBallParent
                color={color}
                opacity={(isSwapping || isDragging) ? 0 : 1}
                scale={1 /*activateTimer.interpolate({
                                            inputRange: [0, .25, .75, 1],
                                            outputRange: isPressed ? [1, .8, 1.2, 1] : [1, 1, 1, 1],
                                            //inputRange: [0, 0.3, 0.6, 0.8, 1],
                                            //outputRange: [1, 0.75, 1.2, 1, .9]
                                        })*/}
                diameter={diameter}
            />
        </RRegisteredSlot>
    )
};


/*
    const slotToBall = (slot: number): BallObject => {
        const object = getSlot(slot);
        return {
            color: getSlotColor(slot),
            top: object ? object.pageY : 0,
            left: object ? object.pageX : 0
        }
    };
 */
/*

                    <RSwapPairOverlay
                        containerOffset={areaOffset}
                        timer={swapEffectTimer}
                        pair={swapping === null ? null : [
                            slotToBall(swapping[0]),
                            slotToBall(swapping[1])
                        ]}
                        diameter={diameter}
                        slotSize={slotSize}
                    />
 */


const withColor = (pair: SwapPair | null, getColor: (slot: number) => string): [Required<MoveProps>, Required<MoveProps>] | null => {
    if (pair === null) return null;
    //not using map because of TS
    return [
        includeColor(getColor)(pair[0]),
        includeColor(getColor)(pair[1]),
    ];
};

const includeColor = (getColor: (slot: number) => string) => (props: MoveProps): Required<MoveProps> => ({
    ...props,
    color: getColor(props.slot),
});


export interface PageLocation {
    pageX: number;
    pageY: number;
}

export interface RegisteredSlot extends PageLocation {
    disabled?: boolean;
}

export interface CompleteSlot extends RegisteredSlot {
    slot: number;
}

//treat long press like the start of a drag
const TAP_MAX_DURATION = 500;
const MOVE_SENSITIVITY = 2;

export const PanTapHandler = ({children, onDragStart, onDragMove, onDragCancel, onDragRelease, onPress}: PropsWithChildren<GestureEvents>) => {


};


/**
 * need to get the props for the overlayed balls from the controller
 * want to leave interpolation ranges, etc. up to the render function
 * should drag, tap swap, drag swap be handled differently?
 */
export type OverlayProps = (TimedLocation | AnimatedLocation) & {
    slot: number;
}

export interface ControllerSlotProps {
    isDragging: boolean;
    isPressed: boolean;
    isSwapping: boolean;
}

export interface ControllerContextValue {
    slots: SlotArray;

    getSlotProps(slot: number): ControllerSlotProps;

    registerSlot(slot: number, location: PageLocation): void;
}

const ControllerContext = createContext<ControllerContextValue>({
    slots: [],
    getSlotProps: () => ({
        isDragging: false,
        isPressed: false,
        isSwapping: false,
    }),
    registerSlot: () => {
        console.error("attempting to register slot outside of ControllerContext provider");
    },
});

export const useRegisteredSlots = (): SlotArray => {
    return useContext(ControllerContext).slots;
};

export const useRegisterSlot = (): RegisterFunction => {
    return useContext(ControllerContext).registerSlot;
};

export const useGetSlotProps = (): (slot: number) => ControllerSlotProps => {
    return useContext(ControllerContext).getSlotProps;
};

export type Pair<T> = [T, T];

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
 * the container position
 * the current touch
 *
 * from props:
 * how to find the slot at a given location (so it can deal with circles, ignore disabled, etc)
 * how to dispatch a swap
 * how to render the dragging or swapping overlays
 *
 * it wraps its children in a context provider so that they can access the swap/touch/selection state
 */
export const SwapController = ({executeSwap, findTarget, RenderOverlayBall, children}: PropsWithChildren<Props>) => {

    /**
     * find out the pageX and pageY of the controller in order to properly position the overlays
     */
    const {ref, onLayout, location = {pageX: 0, pageY: 0}} = useComponentLocation();

    /**
     * the same as location, but in top/left instead of pageX/pageY
     */
    const containerOffset: Offset = {
        top: location.pageY,
        left: location.pageX,
    };

    const {slotAreas, registerSlot} = useSlotRegistry();

    const [pressed, setPressed] = useState<number | null>(null);

    //assume that top/left here are absolute? or not?
    /**
     * for a tap pair, both balls are treated the same so a tuple of 2 ids is fine as order doesn't matter
     * for a drag swap, target vs. pressed matters because need to know which to apply the translate to
     */
    const [swapping, setSwapping] = useState<Pair<OverlayProps> | null>(null);

    const swapEffectTimer = useRef(new Animated.Value(0)).current;

    const activateTimer = new Animated.Value(0);

    const swapProps = (slot: number, targetSlot: number): OverlayProps => ({
        slot,
        start: slotLocation(slot),
        end: slotLocation(targetSlot),
        timer: swapEffectTimer,
    });

    /**
     * activate slot of first press
     * deactivate on repeat press
     * swap on second press
     */
    const onPressSlot = (slot: number) => {
        if (pressed === null) {
            setPressed(slot);
        } else if (pressed === slot) {
            setPressed(null);
        } else {
            setPressed(null);
            setSwapping([
                swapProps(slot, pressed),
                swapProps(pressed, slot)
            ]);
        }
    };

    useEffect(() => {
        if (pressed === null) {
            activateTimer.setValue(0);
        } else {
            makeContinuousAnimation(activateTimer, {
                duration: 2000,
            }).start();
        }
    }, [pressed]);


    /**
     * automatically begins the swapEffectTimer when a swap pair is set
     * and executes the swap when the timer is finished
     *
     * resets the timer to 0 when swap pair is reset to null
     */
    useEffect(() => {
        if (swapping !== null) {
            const [a, b] = swapping;
            Animated.timing(swapEffectTimer, {
                toValue: 1,
                duration: 500
            }).start(() => {
                executeSwap(a.slot, b.slot);
                setSwapping(null);
            });
        } else {
            swapEffectTimer.setValue(0);
        }
    }, [swapping]);

    const isSwapSlot = (slot: number): boolean => {
        return swapping !== null && swapping.some(o => o.slot === slot);
    };

    const isPressedSlot = (slot: number): boolean => {
        return pressed === slot;
    };

    /**
     * note: cannot use the ternary outside of the the animated.interpolate because it is not re-run when isPressed changes,
     * leading to balls frozen at mid-animation size.
     * seems to work ok when putting the ternary inside the interpolation and mapping to 1 regardless of input
     *
     * cannot pass scale with a ternary though a getScale function because the function is not re-run when isPressed changes
     */
    const getScale = (slot: number): number | Animated.Base => {
        return isPressedSlot(slot)
            ? activateTimer.interpolate({
                inputRange: [0, .25, .75, 1],
                outputRange: [1, .8, 1.2, 1],
                //inputRange: [0, 0.3, 0.6, 0.8, 1],
                //outputRange: [1, 0.75, 1.2, 1, .9]
            })
            : 1
    };

    const getSlotProps = (slot: number) => ({
        isSwapping: isSwapSlot(slot),
        isPressed: isPressedSlot(slot),
        isDragging: isDraggingSlot(slot),
        //scale?  activateTimer?
        scale: getScale(slot),
    });

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

    //cleanup function only
    useEffect(() => {
        return clearTapTimeout;
    }, []);

    const touchDelta = (e: GestureResponderEvent): DeltaXY => {
        const start = touchStart === null ? {pageX: 0, pageY: 0} : touchStart;
        return ({
            dx: e.nativeEvent.pageX - start.pageX,
            dy: e.nativeEvent.pageY - start.pageY,
        });
    };

    const valueDelta = (value: I_Point): DeltaXY => {
        const start = touchStart === null ? {pageX: 0, pageY: 0} : touchStart;
        return ({
            dx: value.x - start.pageX,
            dy: value.y - start.pageY,
        });
    };

    const isExceededMoveThreshold = ({dx, dy}: DeltaXY): boolean => { //can pass PanResponderGestureState or can calculate dx & dy
        const distance = Math.sqrt(dx * dx - dy * dy);
        return distance > MOVE_SENSITIVITY;
    };

    const returnToStart = () => {
        Animated.spring(__dragTranslate, {
            toValue: {x: 0, y: 0},
        }).start(() => {
            setPressed(null);
        })
    };

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
     * use responderTarget instead of pressed to avoid confusion around handling second touches
     *
     * set by useEffect on touchStart
     * cleared by ??
     */
    const [responderTarget, setResponderTarget] = useState<CompleteSlot | null>(null);

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

    /**
     * initially set to the target ball by responderTarget effect
     * set by touchLocation listener
     * cleared by ??
     */
    const [hoverSlot, setHoverSlot] = useState<CompleteSlot | null>(null);


    const __dragTranslate = useRef(new Animated.ValueXY()).current;

    const touchLocation = useRef(new Animated.ValueXY()).current;
    //TODO: learn about setOffset, flattenOffset, extractOffset functions on ValueXY

    /**
     * find the target at the start of every touch
     */
    useEffect( () => {
        if ( touchStart !== null ) {
            const target = findTarget(touchStart.pageX, touchStart.pageY, slotAreas);
            //console.log(touchStart);
            //console.log("target", target);
            setResponderTarget(target);
        }
    }, [touchStart]);

    /**
     * begin with hover as the responderTarget
     */
    useEffect( () => {
        setHoverSlot(responderTarget );
    }, [responderTarget]);


    /**
     * on every move, see if drag threshold has been passed
     */
    const moveListener = touchLocation.addListener( ({x, y}) => {
       if ( ! isDrag ) {
           const delta = valueDelta({x,y});
           if ( isExceededMoveThreshold( delta ) ) {
               setIsDrag( true );
           }
       }
    });

    /**
     * find out which, if any, slot is being hovered over
     * for better performance, start by checking current target before checking others
     */

    //const callbackFindHovering =

    /**
     * cleanup
     */
    useEffect(
        () => {
            return () => {
                touchLocation.removeListener(moveListener);
            }
        }, []
    );


    /**
     * callback handlers can take too long, causing a violation
     * to avoid this, the handler itself should just set the state and not do any calculation
     * calculations will be done by useEffect or animation listeners that detect changes made by the handler
     */

    /**
     * start the pan handler if gesture is on a registered slot
     * save that slot or set to null if not starting
     */
    const onStartShouldSetResponder = (e: GestureResponderEvent): boolean => {
        console.log("should start?");
        /**
         * assumes that slots are registered with absolute/page position in order to compare
         * note: event locationX/Y seems to be relative to the smallest component (the ball) even when the handlers are applied to the container
         */
        /*const target = findTarget(e.nativeEvent.pageX, e.nativeEvent.pageY, slotAreas);
        console.log(e.nativeEvent);
        console.log("target", target);
        setResponderTarget(target);
        return !!target;*/
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
        setIsDrag(false);
        setTouchStart(e.nativeEvent);
        tapTimeoutHandler = setTimeout(() => {
            setIsDrag(true);
        }, TAP_MAX_DURATION);
    };
    /**
     * does two things:
     * 1. see if this has moved enough to count as a drag (but don't repeat if already considered dragging)
     *      ands updates isDrag accordingly
     *      (alternatively, could set the dragTranslate regardless and attach an event listener to see when distance exceeded)
     * 2. updated the dragTranslate Animated.ValueXY with the translation
     */
    const onResponderMove = (e: GestureResponderEvent): void => {
        //console.log("move");
        //console.log(e.nativeEvent);
/*        if (!isDrag) {
            if (isExceededMoveThreshold(touchDelta(e))) {
                setIsDrag(true);
            }
        }*/
        Animated.event(
            [{pageX: touchLocation.x, pageY: touchLocation.y}]
        )(e.nativeEvent);
    };
    /**
     * when releasing from a drag, need to find that target that it was released to
     * if there is a target, begin the swap between the gesture slot and the target slot
     * if not, return the ball to its initial position
     *
     * when releasing from tap, will process as either first or second tap based on state of pressed
     * can assume that the release target is the same as the gesture target because if it had moved
     * it would already be considered not a tap
     */
    const onResponderRelease = (e: GestureResponderEvent): void => {
        console.log("release");
        if (responderTarget === null) {
            console.error("releasing from responder without setting responderTarget");
            return;
        }

        //drag
        if (isDrag) {

            const target = findTarget(e.nativeEvent.pageX, e.nativeEvent.pageY, slotAreas);
            if (target === null) {
                returnToStart();
            }
            /**
             * swap move is not symmetric
             * the dragged balls starts from its current/translated position rather than the touch start position
             * touchLocation will be in the middle of the ball, but need to pass the top left corner of the slot
             */
            else {
                const {dx, dy} = touchDelta(e);
                setSwapping([
                    {
                        slot: responderTarget.slot,
                        start: {
                            pageX: responderTarget.pageX + dx,
                            pageY: responderTarget.pageY + dy,
                        },
                        end: target,
                        timer: swapEffectTimer,
                    }, {
                        slot: target.slot,
                        start: target,
                        end: responderTarget,
                        timer: swapEffectTimer,
                    }
                ])
            }
        }
        //tap
        else {
            onPressSlot(responderTarget.slot);
        }
        clearTapTimeout();
    };
    /**
     * gets called when some other element becomes the responder
     */
    const onResponderTerminate = (): void => {
        console.log("terminate");
        returnToStart();
        clearTapTimeout();
    };
    /**
     * honestly not sure when called
     */
    const onResponderEnd = (): void => {
        console.log("end");
        returnToStart();
        clearTapTimeout();
    };

    /**
     * what PanResponder does is add a second parameter - PanResponderGestureState - to each callback function
     * I can avoid PanResponder and use the Gesture Handler functions directly if I store the touch start location in state
     * I do not need any other advanced features such as velocity, multi-finger touch, etc.
     */
    const createPanResponder = () => {

        /** assumes that the passed down findTarget function is expecting relative props */
        const findAbsoluteTarget = (e: GestureResponderEvent) => {
            console.log("page", {pageX: e.nativeEvent.pageX, pageY: e.nativeEvent.pageY});
            const x = e.nativeEvent.pageX - location.pageX;
            const y = e.nativeEvent.pageY - location.pageY;
            console.log("relative", {x, y});
            return findTarget(x, y, slotAreas);
        };

        return PanResponder.create({
            //onMoveShouldSetPanResponder?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            /**
             * start the pan handler if gesture is on a registered slot
             * save that slot or set to null if not starting
             */
            onStartShouldSetPanResponder: (e: GestureResponderEvent, gestureState: PanResponderGestureState): boolean => {
                console.log("should start?");
                /**
                 * right now slot positions are registered with onLayout which uses the relative position
                 * so cannot directly use pageX/Y to compare
                 * locationX/Y seems to be relative to the smallest component (the ball) even when the handlers are applied to the container
                 */
                const target = findAbsoluteTarget(e);
                console.log(e.nativeEvent);
                console.log({target, x: e.nativeEvent.pageX - location.pageX, y: e.nativeEvent.pageY - location.pageY});
                setResponderTarget(target);
                return target !== null;
            },
            onPanResponderGrant: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                console.log("granted");
            },
            //onPanResponderReject, //this is for when it never becomes the responder, so might not need to do anything
            /**
             * assume we are not dragging until told otherwise
             * create timer which automatically converts to a drag after the duration has passed
             */
            onPanResponderStart: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                console.log("start");
                setIsDrag(false);
                tapTimeoutHandler = setTimeout(() => {
                    setIsDrag(true);
                }, TAP_MAX_DURATION);
            },
            /**
             * does two things:
             * 1. see if this has moved enough to count as a drag (but don't repeat if already considered dragging)
             *      ands updates isDrag accordingly
             *      (alternatively, could set the dragTranslate regardless and attach an event listener to see when distance exceeded)
             * 2. updated the dragTranslate Animated.ValueXY with the translation
             */
            onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                console.log("move");
                if (!isDrag) {
                    if (isExceededMoveThreshold(gestureState)) {
                        setIsDrag(true);
                    }
                }
                Animated.event(
                    [{dx: __dragTranslate.x, dy: __dragTranslate.y}]
                )(gestureState);
            },
            /**
             * when releasing from a drag, need to find that target that it was released to
             * if there is a target, begin the swap between the gesture slot and the target slot
             * if not, return the ball to its initial position
             *
             * when releasing from tap, will process as either first or second tap based on state of pressed
             * can assume that the release target is the same as the gesture target because if it had moved
             * it would already be considered not a tap
             */
            onPanResponderRelease: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                console.log("release");
                if (responderTarget === null) {
                    console.error("releasing from responder without setting responderTarget");
                    return;
                }

                //drag
                if (isDrag) {

                    const target = findAbsoluteTarget(e);
                    if (target === null) {
                        returnToStart();
                    }
                    //could save release point, but can already compute it from dragTranslate
                    else {
                        /*setSwapping([
                            responderTarget.slot,
                            target.slot,
                        ])*/
                    }
                }
                //tap
                else {
                    onPressSlot(responderTarget.slot);
                }
                clearTapTimeout();
            },
            /**
             * gets called when some other element becomes the responder
             */
            onPanResponderTerminate: () => {
                console.log("terminate");
                returnToStart();
                clearTapTimeout();
            },
            /**
             * honestly not sure when called
             */
            onPanResponderEnd: () => {
                console.log("end");
                returnToStart();
                clearTapTimeout();
            },

            //onMoveShouldSetPanResponderCapture?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            //onStartShouldSetPanResponderCapture?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            //onPanResponderTerminationRequest?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            //onShouldBlockNativeResponder?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
        });
    };


    const responderRef = useRef(createPanResponder());

    /**
     * in order to avoid stale closures, need to re-create responder when findTarget changes
     */
    useEffect(() => {
        responderRef.current = createPanResponder();
    }, [findTarget]);

    const isDraggingSlot = (slot: number): boolean => {
        return isDrag && responderTarget !== null && responderTarget.slot === slot;
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

    const getOverlayBalls = (): Array<OverlayProps> => { //, containerOffset: Offset
        if (isDrag && responderTarget !== null) {
            return [{
                slot: responderTarget.slot,
                pageX: touchLocation.x,
                pageY: touchLocation.y,
            }];
        } else if (swapping !== null) {
            return swapping;
        } else return [];
    };

    return (
        <ControllerContext.Provider
            value={{
                slots: slotAreas,
                registerSlot,
                getSlotProps,
            }}
        >
            <View
                ref={ref}
                onLayout={onLayout}
                onResponderEnd={onResponderEnd}
                onResponderRelease={onResponderRelease}
                onResponderStart={onResponderStart}
                onStartShouldSetResponder={onStartShouldSetResponder}
                onResponderGrant={onResponderGrant}
                onResponderMove={onResponderMove}
                onResponderTerminate={onResponderTerminate}
            >
                <View>
                    {children}
                </View>
            </View>
            <View>
                {getOverlayBalls().map(
                    (props) => (
                        <RenderOverlayBall
                            key={props.slot}
                            {...props}
                        />
                    )
                )}
            </View>
        </ControllerContext.Provider>
    );
};

//all of the types accepted by Animated config toValue
export type ToValue =
    number
    | Animated.Value
    | { x: number; y: number }
    | Animated.ValueXY
    | Animated.AnimatedInterpolation

export interface ContinuousConfig {
    min?: ToValue;
    max?: ToValue;
    duration: number;
}

export const makeContinuousAnimation = (value: Animated.Value | Animated.ValueXY, {min = 0, max = 1, duration}: ContinuousConfig & Omit<Animated.TimingAnimationConfig, 'toValue'>): Animated.CompositeAnimation => {
    return Animated.loop(
        Animated.sequence([
            Animated.timing(value, {
                toValue: max,
                duration: duration / 2,
                delay: 0,
            }),
            Animated.timing(value, {
                toValue: min,
                duration: duration / 2,
                delay: 0,
            }),
        ])
    );
};
