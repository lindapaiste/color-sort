//doesn't actually need ball id or slot id, just position & color
import React from "react";
import {Animated} from "react-native";
import {Offset} from "../types";
import {RSwapBall} from "./SwapBall";

export interface BallObject {
    top: number;
    left: number;
    color: string;
}

export interface Props {
    timer: Animated.Value;
    pair: [BallObject, BallObject] | null;
    containerOffset?: Offset;
    initialScale?: number | Animated.Base; //TODO: how do I use this?
    diameter: number;
    slotSize: number;
}

export const RSwapPairOverlay = ({pair, ...props}: Props) => {
    if (pair === null) {
        return null;
    }
    const [a, b] = pair;
    return (
        <>
            <RSwapBall
                {...props}
                current={a}
                target={b}
            />
            <RSwapBall
                {...props}
                current={b}
                target={a}
            />
        </>
    )
};
