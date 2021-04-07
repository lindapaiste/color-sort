import {STATES} from "../animated/useLevelAnimation";
import {RBall} from "../animated/AnimatedBall";
import React from "react";
import {Animated} from "react-native";
import {useBoxSwapLevelSelector, useUserSelector} from "../../state";
import {getLayout, getSlotProps} from "../../state/slotSwap/selectors";
import {getSetting} from "../../state/user/selectors";
import {useGetSlotProps} from "../level-touch/ControllerContext";
import {PropSlot} from "../level-touch/types";
import {useBounce} from "../level-touch/useBounce";
import {CRegisteredSlot} from "../level-touch/RegisteredSlot";

export interface CProps {
    slot: number;
    winEffectTiming: Animated.Value;
    loadInTiming: Animated.Value;
    state: STATES;
}

/**
 * some information could be passed down rather then read from redux
 * for example, isCorrect depends on knowing the box, which can be inferred from slot but is already known
 * fade to box color requires box color
 */

/**
 * separate what has to do with getting information from what has to do with displaying
 */

export const useBallSlotProps = ({slot}: PropSlot) => {
    const {diameter, slotSize} = useBoxSwapLevelSelector(getLayout);
    const {isCorrect, boxColor, ballId, color} = useBoxSwapLevelSelector(getSlotProps(slot));
    const isShowCheck = useUserSelector(getSetting('isShowCheck'));
    const isCheck = isCorrect && isShowCheck;
    const {isOverlay, isSwapping, isPressed, isDragging} = useGetSlotProps(slot);

    return {
        color,
        diameter,
        slotSize,
        isCheck,
        ballId,
        isOverlay,
        isPressed,
        boxColor,
    }
};

export interface RProps {
    slot: number;
    winEffectTiming: Animated.Value;
    loadInTiming: Animated.Value;
    color: string;
    diameter: number;
    slotSize: number;
    isCheck: boolean;
    isOverlay: boolean;
    isPressed: boolean;
    boxColor: string;
}

export const CSlotBall = ({slot, winEffectTiming, loadInTiming, state}: CProps) => {

    const {color, diameter, slotSize, isCheck, ballId, isOverlay, isPressed, boxColor} = useBallSlotProps({slot});

    const bouncyScale = useBounce(isPressed);

    return (
        <CRegisteredSlot slot={slot}>
            <RBall
                color={winEffectTiming.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [color, boxColor, boxColor],
                })}
                diameter={diameter}
                isCheck={isCheck && state === STATES.PLAYING}
                scale={state === STATES.LOADING_IN ? loadInTiming.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }) : state === STATES.PLAYING ? bouncyScale
                    : winEffectTiming.interpolate({
                        inputRange: [0, .5, 1],
                        outputRange: [1, slotSize / diameter, slotSize / diameter],
                    })}
                opacity={isOverlay ? 0 : 1}
                borderRadius={winEffectTiming.interpolate({
                    inputRange: [0, .5, 1],
                    outputRange: [.5, 0, 0],
                })}
            />
        </CRegisteredSlot>
    )

};
