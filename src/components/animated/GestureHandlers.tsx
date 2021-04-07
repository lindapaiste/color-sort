import React, {createRef, PropsWithChildren} from "react";
import {
    PanGestureHandler,
    PanGestureHandlerStateChangeEvent,
    State,
    TapGestureHandler
} from "react-native-gesture-handler";
import {GestureEvents} from "./DragOrTap";

/**
 * this does nothing except map standardized events to components from react-native-gesture-handlers
 */
export const GestureHandlers = ({children, onDragStart, onDragMove, onDragCancel, onDragRelease, onPress}: PropsWithChildren<GestureEvents>) => {

    const panRef = createRef<PanGestureHandler>();
    const tapRef = createRef<TapGestureHandler>();

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
        <TapGestureHandler
            ref={tapRef}
            simultaneousHandlers={panRef}
            //onHandlerStateChange={}
            onGestureEvent={e => {
                console.log("tap event");
                console.log(e);
                onPress(e.nativeEvent);
            }}
        >
            <PanGestureHandler
                ref={panRef}
                simultaneousHandlers={tapRef}
                onGestureEvent={e => {
                    console.log("pan event");
                    console.log(e);
                    onDragMove(e.nativeEvent);
                }}
                onHandlerStateChange={e => {
                    console.log("pan state change");
                    console.log(e.nativeEvent);
                    _handleDragStateChange(e);
                }}
            >
                {children}
            </PanGestureHandler>
        </TapGestureHandler>
    )
};
