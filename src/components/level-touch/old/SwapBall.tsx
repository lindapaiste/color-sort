import React from "react";
import {mapTimedLocation} from "../withTimedPosition";
import {Offset} from "../types";
import {ROverlayBall} from "./OverlayBall";
import {BallObject, Props} from "./SwapPair";
import {offsetToPageXy} from "../calc";

export const RSwapBall = ({current, target, timer, ...passed}: Omit<Props, 'pair'> & { current: BallObject, target: Offset }) => {

    const {pageX, pageY} = mapTimedLocation({start: offsetToPageXy(current), end: offsetToPageXy(target), timer});

    return (
        <ROverlayBall
            {...passed}
            top={pageY}
            left={pageX}
            color={current.color}
            scale={timer.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [1, 0.75, 0.75, 1]
            })}
        />
    )
};
