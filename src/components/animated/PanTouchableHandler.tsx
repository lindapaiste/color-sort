import React, {PropsWithChildren} from "react";
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from "react-native-gesture-handler";
import {GestureEvents} from "./DragOrTap";
import {TouchableHighlight} from "react-native";

/**
 * this does nothing except map standardized events to components from react-native-gesture-handlers
 */
export const PanTouchableHandler = ({children, onDragStart, onDragMove, onDragCancel, onDragRelease, onPress}: PropsWithChildren<GestureEvents>) => {

    const _handleDragStateChange = (e: PanGestureHandlerStateChangeEvent): void => {
        switch (e.nativeEvent.state) {
            case State.CANCELLED:
            case State.FAILED:
                onDragCancel(e.nativeEvent);
                break;
            case State.END:
                onDragRelease(e.nativeEvent);
                break;
            case State.BEGAN:
            case State.ACTIVE:
                onDragStart(e.nativeEvent);
        }
    };

    return (
        <TouchableHighlight
            onPress={e => {
                console.log("tap event");
                console.log(e);
                onPress({
                    x: e.nativeEvent.pageX,
                    y: e.nativeEvent.pageY,
                });
            }}
        >
            <PanGestureHandler
                onGestureEvent={e => {
                    //console.log("pan event");
                    //console.log(e);
                    onDragMove(e.nativeEvent);
                }}
                onHandlerStateChange={e => {
                    //console.log("pan state change");
                    //console.log(e.nativeEvent);
                    _handleDragStateChange(e);
                }}
            >
                {children}
            </PanGestureHandler>
        </TouchableHighlight>
    )
};
