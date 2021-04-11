import React, {PropsWithChildren} from "react";
import {Animated, ViewStyle} from "react-native";
import {useDimensions} from "../../ui/vwHooks";
import {styles} from "../../ui/styles";
import {random} from "lodash";
import {useSelector} from "../../state";
import {selectBoxColorById, selectLayout} from "../../state/slotSwap/selectors";

/**
 * win effect:
 * from 0 to .5, do fade to solid block
 * from .5 to 1, do slide over to black
 */

export interface CProps {
    index: number;
    winEffectTiming: Animated.Value;
}


export interface RProps {
    color: string;
    style: Animated.WithAnimatedValue<ViewStyle>;
}

/**
 * constant properties:
 * borderWidth
 * timingOffset multiplier
 * elevation
 */

//does it make sense to pass the timer through context?

/**
 * use redux to access box color and padding
 * use dimensions for slide off screen
 * interpolate the timer into style effects
 */
export const CBox = ({index, winEffectTiming, ...props}: PropsWithChildren<CProps>) => {
    const color = useSelector(selectBoxColorById(index));
    const padding = useSelector(selectLayout).boxPadding; //is the min of vw or vh

    const timingOffset = random(-.1, .1, true);
    const screenWidth = useDimensions().width;

    //alternates between left and right based on index
    const translateX = winEffectTiming.interpolate({
        inputRange: [0, .5 + timingOffset, 1],
        outputRange: [0, 0, (index % 2 ? -1 : 1) * screenWidth]
    });

    const backgroundColor = winEffectTiming.interpolate({
        inputRange: [0, .5 + timingOffset, 1],
        outputRange: ["rgb(0,0,0)", color, color]
    });

    return <RBox
        {...props}
        color={color}
        style={{
            padding,
            backgroundColor,
            transform: [{translateX}],
        }}
    />
};

//don't set margin here, that's where the tweaking can happen by the DOM

/**
 * pure render basically just combines passed styles with CSS box styles
 */
export const RBox = ({color, style, children}: PropsWithChildren<RProps>) => {

    return (
        <Animated.View
            style={[
                styles.centerContents,
                styles.boxBorder,
                {borderColor: color},
                style,
            ]}
        >
            {children}
        </Animated.View>
    )
};

/**
 * on fadeOut, can have either:
 * boxPadding goes to to 0 and is replaced by an increase in borderWidth
 * backgroundColor fades in from black/none/inherit to color
 * can make use of opacity on color but this is tricky because opacity applies to contents as well
 */
