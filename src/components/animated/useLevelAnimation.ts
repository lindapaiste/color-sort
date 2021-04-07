import {useEffect, useRef} from "react";
import {Animated} from "react-native";

export enum STATES {
    LOADING_IN,
    PLAYING,
    WIN_TRANSITION,
    WIN_SCREEN,
}


/**
 * central controller for animated values used by various render methods
 */
export const useLevelAnimation = ({slotSize, diameter}: {slotSize: number, diameter: number}) => {

    const fadeOut = useRef(new Animated.Value(0)).current;
    const slideOver = useRef(new Animated.Value(0)).current;
    const baseDiameter = useRef(new Animated.Value(0)).current;

    const startLoadIn = () => {
        console.log("load in animation");
        Animated.timing(baseDiameter, {
            toValue: diameter,
            duration: 1000,
        }).start();
    };

    const startWinEffect = () => {
        console.log("win effect animation");
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeOut, {
                    toValue: 1,
                    duration: 3000,
                }),
                Animated.timing(baseDiameter, {
                    toValue: slotSize,
                    duration: 3000,
                })
            ]),
            Animated.timing(slideOver, {
                toValue: 1,
                duration: 3000,
            }),
        ]).start();
    };

    const resetWinEffect = () => {
        console.log("resetting animation");
        fadeOut.setValue(0);
        slideOver.setValue(0);
        baseDiameter.setValue(0);
    };

    return {
        fadeOut,
        slideOver,
        baseDiameter,
        startLoadIn,
        startWinEffect,
        resetWinEffect,
    }

};
