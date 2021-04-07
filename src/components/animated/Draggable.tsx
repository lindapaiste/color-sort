import React, {FunctionComponent, useState} from "react";
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from "react-native-gesture-handler";
import Animated from 'react-native-reanimated';
import {Animated as AnimatedN, View} from "react-native";
/**
 * note: version 2 of reanimated uses hooks and is much more intuitive,
 * but is not yet shipped to expo
 * as of 6/8/2020
 */

/**
 * want to use an animation for the snap to place effect,
 * but not sure if it is needed for the translation effect
 */

//FAIL
export const DraggableA: FunctionComponent<{}> = ({children}) => {

    const x = new Animated.Value(0);
    const y = new Animated.Value(0);

    return (
        <PanGestureHandler
            onGestureEvent={e => {
                //console.log(e);
                Animated.set(x, e.nativeEvent.translationX);
                Animated.set(y, e.nativeEvent.translationY);
            }}
        >
            <Animated.View style={{
                transform: [
                    {translateX: x},
                    {translateY: y}
                ]
            }}
            >
                {children}
            </Animated.View>
        </PanGestureHandler>
    )
};

//OK, but shows weird box
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
                transform: [
                    {translateX: x},
                    {translateY: y}
                ]
            }}>
                {children}
            </View>
        </PanGestureHandler>
    )
};

//OK
export const DraggableN: FunctionComponent<{}> = ({children}) => {
    const xy = new AnimatedN.ValueXY({x: 0, y: 0});

    const _returnToStart = (): void => {
        AnimatedN.spring(
            xy,
            {
                toValue: {x: 0, y: 0},
            }
        ).start();
    };

    const _bouncy = (): void => {

    };

    const _onStateChange = (e: PanGestureHandlerStateChangeEvent): void => {
        switch (e.nativeEvent.state) {
            case State.CANCELLED:
            case State.END:
            case State.FAILED:
                _returnToStart();
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={e => xy.setValue({x: e.nativeEvent.translationX, y: e.nativeEvent.translationY})}
            onHandlerStateChange={e => {
                console.log(e.nativeEvent.state);
                _onStateChange(e);
            }}
        >
            <AnimatedN.View style={{
                transform: [
                    {translateX: xy.x},
                    {translateY: xy.y}
                ]}}>
                {children}
            </AnimatedN.View>
        </PanGestureHandler>
    )
};

/**
 * note state change event has values state AND oldState
 */
