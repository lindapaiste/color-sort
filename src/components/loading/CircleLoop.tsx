import React from "react";
import {Animated, View} from "react-native";

export const shift = <T extends any>(array: T[], i: number): T[] => {
    return [...array.slice(i),...array.slice(0, i)];
};


/**
 * loops through a provided array of colors
 * problem: sticks on start and end, doesn't circle through
 */

export const CirclesLoop = ({colors}: {colors: string[]} ) => {
    const anim = new Animated.Value(0);

    Animated.loop(Animated.timing(anim, {
        toValue: colors.length - 1,
        duration: 6000,
    }), {
    }).start();

    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
            }}
        >
            {colors.map( (color, i) => (
                <Animated.View
                    key={color}
                    style={{
                        backgroundColor:
                            anim.interpolate({
                                inputRange: [...colors.keys()],
                                outputRange: shift(colors, i),
                            }),
                        borderRadius: "50%",
                        width: 80,
                        height: 80,
                    }}
                />
            ))}
        </View>
    );
};

export const AnimatedCircle = ({index, colors, value}: {colors: string[], index: number, value: Animated.Value}) => {
    return (
        <Animated.View
            style={{
                backgroundColor:
                    value.interpolate({
                        inputRange: [...colors.keys()],
                        outputRange: shift(colors, index),
                    }),
                borderRadius: "50%",
                width: 80,
                height: 80,
            }}
        />
    )
};
