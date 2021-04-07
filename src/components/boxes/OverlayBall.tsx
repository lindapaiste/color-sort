import React from "react";
import {OverlayProps} from "../level-touch/types";
import {ROverlayPosition} from "../level-touch/OverlayPosition";
import {RBasicBall} from "../level-touch/BasicBall";
import {useLayout} from "./LayoutRedux";
import {useBoxSwapLevelSelector} from "../../state";
import {getSlotColor} from "../../state/slotSwap/selectors";

/**
 * takes the overlay props to get position and scale,
 * but gets color and dimensions from redux
 */
export const RenderOverlayBall = (props: OverlayProps) => {

    const {slotSize, diameter} = useLayout();
    const color = useBoxSwapLevelSelector(getSlotColor(props.slot));

    return (
        <ROverlayPosition {...props}>
            <RBasicBall
                color={color}
                slotSize={slotSize}
                diameter={diameter}
            />
        </ROverlayPosition>
    )
};
