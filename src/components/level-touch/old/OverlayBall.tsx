import React from "react";
import {Props as BasicProps, RBasicBall} from "../BasicBall";
import {RPositioned} from "../Positioned";
import {PositionProps} from "../types";

export const ROverlayBall = ({top, left, containerOffset, ...ballProps}: PositionProps & BasicProps) => (
    <RPositioned
        top={top}
        left={left}
        containerOffset={containerOffset}
    >
        <RBasicBall
            {...ballProps}
        />
    </RPositioned>
);


