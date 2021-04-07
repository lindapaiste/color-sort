import {RBallSlot} from "../boxes/BallSlot";
import {RBall} from "../animated/AnimatedBall";
import React from "react";
import {Animated} from "react-native";

export interface Props {
    color: string | Animated.Base;
    slotSize: number;
    diameter: number;
    scale?: number | Animated.Base;
}

export const RBasicBall = ({scale = 1, diameter, slotSize, color}: Props) => {
    return (
        <RBallSlot
            slotSize={slotSize}
        >
            <RBall
                color={color}
                diameter={diameter}
                scale={scale}
            />
        </RBallSlot>
    )
};
