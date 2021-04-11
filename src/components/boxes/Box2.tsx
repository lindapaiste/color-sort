import React, {PropsWithChildren} from "react";
import {Animated} from "react-native";
import {useDimensions} from "../../ui/vwHooks";
import {styles} from "../../ui/styles";
import {useSelector} from "../../state";
import {selectBoxColorById, selectLayout} from "../../state/slotSwap/selectors";
import {CProps} from "./Box";
import {random} from "lodash";

/**
 * I think it would look nice to animated fade out by border width increasing rather than background color opacity, but this is tricky
 * increase in border must be offset by decrease in padding
 *
 * to deal with adding increase border to base border, use an inner and an outer container
 * such that the original widths are attached to the outer and unchanged, while inner increases from 0
 * this prevents having to add a fixed value to the animation, and having to define left separate from the others
 */


export const CBox = ({index, children, winEffectTiming}: PropsWithChildren<CProps>) => {
    const color = useSelector(selectBoxColorById(index));
    const {boxPadding} = useSelector(selectLayout); //is the min of vw or vh

    const timingOffset = random(-.1, .1, true);
    const screenWidth = useDimensions().width;

    //alternates between left and right based on index
    const translateX = winEffectTiming.interpolate({
        inputRange: [0, .5 + timingOffset, 1],
        outputRange: [0, 0, (index % 2 ? -1 : 1) * screenWidth]
    });

    //padding shrinks from the original amount to 0
    const padding = winEffectTiming.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [boxPadding, 0, 0]
    });

    //inner border width increases from 0 to the padding amount
    const borderWidth = winEffectTiming.interpolate({
        inputRange: [0, .5, 1],
        outputRange: [0, boxPadding, boxPadding]
    });

    return (
        <Animated.View
            style={[
                styles.boxBorder,
                {
                    borderColor: color,
                    transform: [{translateX}],
                }
            ]}
        >
            <Animated.View
                style={[
                    styles.centerContents,
                    {
                        borderColor: color,
                        padding,
                        borderWidth,
                    }
                ]}
            >
                {children}
            </Animated.View>
        </Animated.View>

    )
};
