import React, {FunctionComponent, PropsWithChildren} from "react";
import {LayoutChangeEvent, View, ViewProps, ViewStyle} from "react-native";
import {withSizing} from "./LayoutRedux";
import {PropZoneId, withOnLayout} from "../animated/DropZone";
import {styles} from "../../ui/styles";
import {Size} from "./calcSizing";

export interface Props {
    slotSize: number;
    onLayout?: (e: LayoutChangeEvent) => void;
}

/**
 * want the space which is filled by the ball to be a fixed amount
 * so that the ball "hole" is not impacted changes to diameter
 * slot size is not impacted by any animations at the moment
 * basically just a fixed size square whose contents are centered
 * ballMargin no longer needs to be set because ball is always centered
 */
export const RBallSlot = ({slotSize, children, onLayout, ...props}: PropsWithChildren<Props & ViewProps>) => {
    return (
        <View
            {...props}
            style={[
                styles.centerContents,
                slotDimensions(slotSize)
            ]}
            onLayout={onLayout}
        >
            {children}
        </View>
    )
};

export const slotDimensions = (slotSize: number): Size => ({
    width: slotSize,
    height: slotSize
});

export const CBallSlot: FunctionComponent<PropZoneId> = withOnLayout(withSizing(RBallSlot));
