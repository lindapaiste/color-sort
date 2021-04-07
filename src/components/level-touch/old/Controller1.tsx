import React, {PropsWithChildren, useEffect, useRef, useState} from "react";
import {
    Animated,
    GestureResponderEvent,
    LayoutChangeEvent,
    NativeTouchEvent,
    PanResponder,
    PanResponderGestureState,
    TouchableHighlight,
    View
} from "react-native";
import {ControllerSlotProps, Offset} from "../types";
import {colorString, createRandom} from "../../../util/color-util";
import {findIndex, range} from "lodash";
import {eventTargetOffset, relativeOffset, xyToOffset} from "../calc";
import {RBallSlot} from "../../boxes/BallSlot";
import {RBallParent} from "../../animated/AnimatedBall";
import {RSwapPairOverlay} from "./SwapPair";
import {replaceIndex, swapIndexes} from "../../../util/array-edit";
import {GestureEvents} from "../../animated/DragOrTap";

//TODO: swap has wrong offset because of inconsistency between ball offset and slot offset

export interface MoveProps {
    slot: number;
    top: number;
    left: number;
    color?: string;
}

type SwapPair = [MoveProps, MoveProps];

type ExecuteSwap = (a: MoveProps, b: MoveProps) => void;

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
        setSlots(swapIndexes(slots, a.slot, b.slot));
    };

    const {getSlotProps, onLayoutContainer, swapEffectTimer, swapping, activateTimer} = useController({executeSwap});

    return (
        <>
            <View
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    flexDirection: "row",
                    marginLeft: 25,
                }}
                onLayout={onLayoutContainer}
            >
                {slots.map((id, slot) => {
                    const {onPress, isSwapping, isPressed, scale} = getSlotProps(slot);
                    return (
                        <TouchableHighlight
                            key={id}
                            onPress={e => {
                                //console.log(e.nativeEvent);
                                onPress(e.nativeEvent);
                            }}
                        >
                            <View>
                                <RBallSlot slotSize={slotSize}>
                                    <RBallParent
                                        color={getBallColor(id)}
                                        opacity={isSwapping ? 0 : 1}
                                        scale={activateTimer.interpolate({
                                            inputRange: [0, .25, .75, 1],
                                            outputRange: isPressed ? [1, .8, 1.2, 1] : [1, 1, 1, 1],
                                            //inputRange: [0, 0.3, 0.6, 0.8, 1],
                                            //outputRange: [1, 0.75, 1.2, 1, .9]
                                        })}
                                        diameter={diameter}
                                    />
                                </RBallSlot>
                            </View>
                        </TouchableHighlight>
                    )
                })}
                <RSwapPairOverlay
                    timer={swapEffectTimer}
                    pair={withColor(swapping, getSlotColor)}
                    diameter={diameter}
                    slotSize={slotSize}
                />
            </View>
        </>
    )

};

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

interface Props {
    executeSwap: ExecuteSwap;
}

interface Location {
    pageX: number;
    pageY: number;
}

interface RegisteredSlot extends Location {
    disabled?: boolean;
}

interface CompleteSlot extends RegisteredSlot {
    slot: number;
}

//treat long press like the start of a drag
const TAP_MAX_DURATION = 500;
const MOVE_SENSITIVITY = 2;

export const PanTapHandler = ({children, onDragStart, onDragMove, onDragCancel, onDragRelease, onPress}: PropsWithChildren<GestureEvents>) => {


};

/**
 * could define this is a very generic and extensible way where every slot has a width and height,
 * but that seems silly when the size is the same for all of them
 * also if I store a fixed value it could become outdated
 *
 * could store this data in redux, or could store it in state
 *
 * slotSize might change on resize -- unlikely but possible
 *
 *
 * should save disabled/enabled here?  or figure out further up the chain?
 *
 * is it better to use numeric slot ids vs refs, or is it all the same?
 */

export const useRegisteredSlots = (slotSize: number, diameter: number) => {
    const [slotAreas, setSlotAreas] = useState<Array<RegisteredSlot | undefined>>([]);

    const registerSlot = (id: number, location: Location, disabled: boolean = false): void => {
        setSlotAreas(replaceIndex(slotAreas, id, {...location, disabled}));
    };

    const disableSlot = (id: number, disabled: boolean = true): void => {
        const existing = slotAreas[id];
        if (existing === undefined) {
            console.error(`cannot disable slot id #${id} because it is undefined`);
            return;
        }
        setSlotAreas(replaceIndex(slotAreas, id, {
            ...existing,
            disabled,
        }))
    };

    const unregisterSlot = (id: number): void => {
        //want to preserve indexes, so set to undefined rather than removing
        setSlotAreas(replaceIndex(slotAreas, id, undefined));
    };

    const clear = (): void => {
        //unregisters everything
        setSlotAreas([]);
    };

    const areaContains = (slot: Location | undefined, x: number, y: number): boolean => {
        return (
            slot !== undefined &&
            x > slot.pageX &&
            x < slot.pageX + slotSize &&
            y > slot.pageY &&
            y < slot.pageY + slotSize
        );
    };

    const circleContains = (slot: Location, x: number, y: number): boolean => {
        //find the distance from the center of the circle to the point and see if it is less than the radius
        const center = {
            x: slot.pageX + .5 * diameter,
            y: slot.pageY + .5 * diameter,
        };
        const distance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
        return distance < .5 * diameter;
    };

    const isInSlot = (x: number, y: number): CompleteSlot | null => {  //include slot id???
        //will never be more than one slot
        const i = findIndex(slotAreas, slot => areaContains(slot, x, y));
        return i === undefined ? null : {
            ...slotAreas[i] as RegisteredSlot,
            slot: i
        };
    };

    const isInCircle = (x: number, y: number): CompleteSlot | null => {
        const slot = isInSlot(x, y);
        return slot && circleContains(slot, x, y) ? slot : null;
    };

    const registerOnLayout = (id: number, disabled?: boolean) => (e: LayoutChangeEvent): void => {
        registerSlot(id, {
                pageX: e.nativeEvent.layout.x,
                pageY: e.nativeEvent.layout.y
            },
            disabled);
    };

    return {
        registerSlot,
        unregisterSlot,
        clear,
        areaContains,
        circleContains,
        isInSlot,
        isInCircle,
        registerOnLayout,
    }
};

interface ControllerReturn {
    getSlotProps: (slot: number) => ControllerSlotProps;
    onLayoutContainer: (e: LayoutChangeEvent) => void;
    swapping: SwapPair | null;
    swapEffectTimer: Animated.Value;
    activateTimer: Animated.Value;
}

/**
 * use slot ids rather than ball ids because when looking up by location it is easier to find the slot than the ball
 */
export const useController = ({executeSwap}: Props) => {
    const [areaOffset, setAreaOffset] = useState<Offset>({top: 0, left: 0});

    const [pressed, setPressed] = useState<MoveProps | null>(null);

    //assume that top/left here are absolute? or not?
    const [swapping, setSwapping] = useState<SwapPair | null>(null);

    const swapEffectTimer = new Animated.Value(0);

    const activateTimer = new Animated.Value(0);

    const swapProps = (slot: number, e: NativeTouchEvent) => {
        return {
            slot,
            //can do relative or absolute
            //...eventTargetOffset(e),
            ...relativeOffset(eventTargetOffset(e), areaOffset)
        }
    };

    const onPressSlot = (slot: number) => (e: NativeTouchEvent) => {
        if (pressed === null) {
            setPressed(swapProps(slot, e));
        } else if (pressed.slot === slot) {
            setPressed(null);
        } else {
            setPressed(null);
            setSwapping([swapProps(slot, e), pressed]);
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

    useEffect(() => {
        if (swapping !== null) {
            const [a, b] = swapping;
            Animated.timing(swapEffectTimer, {
                toValue: 1,
                duration: 500
            }).start(() => {
                executeSwap(a, b);
                setSwapping(null);
            });
        }
    }, [swapping]);

    const isSwapSlot = (slot: number): boolean => {
        return swapping !== null && swapping.some(s => s.slot === slot);
    };

    const isPressedSlot = (slot: number): boolean => {
        return pressed !== null && pressed.slot === slot;
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
        onPress: onPressSlot(slot),
    });

    const onLayoutContainer = (e: LayoutChangeEvent) => {
        setAreaOffset(xyToOffset(e.nativeEvent.layout));
    };


    const [isDrag, setIsDrag] = useState(false);

    const dragTranslate = useRef(new Animated.ValueXY()).current;
    //TODO: learn about setOffset, flattenOffset, extractOffset functions on ValueXY

    /**
     * setTimeout will call a function after the duration has elasped
     * unless it has been cleared/cancelled before then
     *
     * treat the touch as a drag if it exceeds the timeout,
     * and a touch if it ends before the timer
     *
     * also want to treat as a drag if significant movement occurs, even if quicker than timeout
     */
    const tapTimeout = null;

    const isExceededMoveThreshold = (gestureState: PanResponderGestureState): boolean => {
        const distance = Math.sqrt(gestureState.dx * gestureState.dx + gestureState.dy * gestureState.dy);
        return distance > MOVE_SENSITIVITY;
    };

    const returnToStart = () => {
        Animated.spring(dragTranslate, {
            toValue: {x: 0, y: 0},
        }).start(() => {
            setIsDrag(false);
            setPressed(null);
        })
    };

    const responder = useRef(
        PanResponder.create({
            //onMoveShouldSetPanResponder?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            //onStartShouldSetPanResponder?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            //onPanResponderGrant?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
            onPanResponderMove: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                console.log("move");
                //see if this counts as a drag, but only if not already considered dragging
                if (!isDrag) {
                    if (isExceededMoveThreshold(gestureState)) {
                        setIsDrag(true);
                    }
                }
                //handle move
                Animated.event(
                    [{dx: dragTranslate.x, dy: dragTranslate.y}]
                )(gestureState);
            },
            //onPanResponderRelease?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
            onPanResponderTerminate: returnToStart,

            //onMoveShouldSetPanResponderCapture?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            //onStartShouldSetPanResponderCapture?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            //onPanResponderReject: returnToStart,
            onPanResponderStart: (e: GestureResponderEvent, gestureState: PanResponderGestureState): void => {
                console.log("start");

            },
            //onPanResponderEnd?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => void;
            //onPanResponderTerminationRequest?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
            //onShouldBlockNativeResponder?: (e: GestureResponderEvent, gestureState: PanResponderGestureState) => boolean;
        })
    ).current;

    const isDraggingSlot = (slot: number): boolean => {
        return isDrag && isPressedSlot(slot);
    };

    return {
        getSlotProps,
        onLayoutContainer,
        swapping,
        swapEffectTimer,
        activateTimer,
    }
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
