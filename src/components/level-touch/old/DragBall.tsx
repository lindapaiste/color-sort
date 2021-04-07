import {Animated} from "react-native";
import {Offset} from "../types";
import {RPositioned} from "../Positioned";
import React from "react";
import {Props as BasicProps, RBasicBall} from "../BasicBall";

/**
 * for the overlay while dragging
 * need to edit for move to final position
 */

export interface Props extends BasicProps {
    dragTransform: Animated.ValueXY;
    containerOffset?: Offset;
}


export const RDragBall = ({dragTransform, containerOffset, ...ballProps}: Props) => {
    return (
        <RPositioned
            top={dragTransform.y}
            left={dragTransform.x}
            containerOffset={containerOffset}
        >
            <RBasicBall
                scale={1} //TODO
                {...ballProps}
            />
        </RPositioned>
    )
};
