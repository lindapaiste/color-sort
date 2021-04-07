import {Animated} from "react-native";
import {useEffect, useRef} from "react";

export const useBounce = (isBouncy: boolean): Animated.Base => {

    const bouncyTimer = useRef(new Animated.Value(0)).current;

    const continuousBounce = Animated.loop(
        Animated.sequence([
            Animated.timing(bouncyTimer, {
                toValue: 1,
                duration: 1000,
                delay: 0,
            }),
            Animated.timing(bouncyTimer, {
                toValue: 0,
                duration: 1000,
                delay: 0,
            }),
        ])
    );

    /**
     * run effect when starts or stops being bouncy
     * will unnecessarily run stop once on mount
     * could prevent (local state didBounce?) but idk if it's worth it
     */
    useEffect(
        () => {
            if (isBouncy) {
                continuousBounce.start();
            } else {
                //want to fade out nicely but quickly -- right now is too jerky
                Animated.timing(bouncyTimer, {
                    toValue: 0,
                    duration: 200,
                }).start();
            }
        },
        [isBouncy]
    );

    return bouncyTimer.interpolate({
        inputRange: [0, .25, .75, 1],
        outputRange: [1, .8, 1.2, 1],
    });
};
