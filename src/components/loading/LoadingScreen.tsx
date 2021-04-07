import React from "react";
import {Animated, Text, View} from "react-native";
import {styles} from "../../ui/styles";

/**
 * initially wanted to have a gradient row of balls representing a progress bar with the current ball bouncing and the following balls hidden
 * turns out the percent loaded is not something I have access to
 * so needs to be just a plain animation
 */

/**
 * cycling through all colors should be easy with HSL, but I'm having trouble interpolating properly
 * can't just cast to 'hsl(' + anim + '50%, 50%)'
 * going from ['hsl(0, 50%, 50%}', 'hsl(360, 50%, 50%)'] seems to go through gray rather than through the hue range
 */

/**
 * right now have one ball going back and forth between two colors
 */
export const LoadingScreen = () => {

    const anim = new Animated.Value(0);

    Animated.loop(Animated.timing(anim, {
        toValue: 1,
        duration: 3000,
    }), {}).start();

    const colors = ['rgb(27, 228, 178)', 'rgb(141, 227, 104)']; //TODO

    return (
        <View style={styles.screen}>
            <View
                style={{
                    //first 3 commented out lines seem to not make any difference
                    //flex: 1,
                    //alignSelf: "center",
                    //flexDirection: "column",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Animated.View
                    style={{
                        backgroundColor: anim.interpolate({
                            inputRange: [0, .5, 1],
                            outputRange: [colors[0], colors[1], colors[0]],
                        }),
                        borderRadius: "50%",
                        width: 80,
                        height: 80,
                    }}
                />
                <Text style={{
                    paddingTop: 20,
                    color: "white",
                    fontSize: 20,
                    textTransform: "uppercase"
                }}>
                    Loading
                </Text>
            </View>
        </View>
    )
};
