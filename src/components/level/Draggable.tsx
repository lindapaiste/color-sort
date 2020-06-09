import React from "react";
import {PanGestureHandler} from "react-native-gesture-handler";
import Animated, { Easing } from 'react-native-reanimated';
import {FunctionComponent, useState} from "react";
import {View} from "react-native";
import {Animated as AnimatedN} from "react-native";
/**
 * note: version 2 of reanimated uses hooks and is much more intuitive,
 * but is not yet shipped to expo
 * as of 6/8/2020
 */

/**
 * want to use an animation for the snap to place effect,
 * but not sure if it is needed for the translation effect
 */

export const DraggableA: FunctionComponent<{}> = ({children}) => {

    const x = new Animated.Value(0);
    const y = new Animated.Value(0);

    return (
        <PanGestureHandler
        onGestureEvent={e => {
            console.log(e);
            Animated.set(x, e.nativeEvent.translationX);
            Animated.set(y, e.nativeEvent.translationY);
        }}
        >
            <Animated.View style={{
                translateX: x,
                translateY: y,
            }}
            >
            {children}
            </Animated.View>
        </PanGestureHandler>
    )
};


export const DraggableS: FunctionComponent<{}> = ({children}) => {

    const [x, setX] = useState(0);
    const [y, setY] = useState(0);

    return (
        <PanGestureHandler
            onGestureEvent={e => {
                console.log(e);
                setX(e.nativeEvent.translationX);
                setY(e.nativeEvent.translationY);
            }}
        >
            <View style={{
                translateX: x,
                translateY: y,
            }}>
            {children}
            </View>
        </PanGestureHandler>
    )
};

export const DraggableN: FunctionComponent<{}> = ({children}) => {
  const xy = new AnimatedN.ValueXY({x: 0, y: 0});

    return (
        <PanGestureHandler
            onGestureEvent={e => xy.setValue({x: e.nativeEvent.translationX, y: e.nativeEvent.translationY})}
        >
            <AnimatedN.View style={{
                translateX: xy.x,
                translateY: xy.y,
            }}>
                {children}
            </AnimatedN.View>
        </PanGestureHandler>
    )
};
