import React, {PropsWithChildren} from "react";
import {Animated, ViewProps} from "react-native";
import {PositionProps} from "./types";


/**
 * the coordinates of an absolute position are relative to the parent, not to the screen/page
 *
 * this component can accept relative coordinates, in which case containerOffset should be omitted
 *
 * in can also accept an offset which is absolute to the page.  In this case, a containerOffset is needed in order to render properly
 */

export const RPositioned = ({top, left, style = {}, containerOffset = {top: 0, left: 0}, ...props}: PropsWithChildren<PositionProps & Animated.AnimatedProps<ViewProps>>) => (
    <Animated.View
        {...props}
        style={[style, {
            position: "absolute",
            top: -1 * containerOffset.top,
            left: -1 * containerOffset.left,
            transform: [
                {translateX: left},
                {translateY: top}
            ]
        }]}
    />
);


