import {PropsWithChildren, useState} from "react";
import {Animated} from "react-native";
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from "react-native-gesture-handler";
import {findDropZone} from "./findDropZone";
import React from "react";
import {DragCallbacks} from "./DragOrTap";
import {DropZoneMap, LOCATIONS} from "../../state/scale/types";

export interface BaseDragProps {
    zones: Partial<DropZoneMap>,
    currentLocation: LOCATIONS,
}

export const Dragger = ({
                            children, currentLocation, zones, onMove = () => {
    }, onDragStart = () => {
    }, onReturn = () => {
    }
                        }: PropsWithChildren<BaseDragProps & DragCallbacks>) => {

    const xy = new Animated.ValueXY({x: 0, y: 0});

    const _returnToStart = (): void => {
        Animated.spring(
            xy,
            {
                toValue: {x: 0, y: 0},
            }
        ).start();
        //callback
        onReturn();
    };

    const _handleRelease = (e: PanGestureHandlerStateChangeEvent): void => {
        const newZone = findDropZone(zones)(e.nativeEvent.absoluteX, e.nativeEvent.absoluteY);
        console.log({
            zones,
            currentLocation,
            newZone,
            x: e.nativeEvent.absoluteX,
            y: e.nativeEvent.absoluteY,
            e: e.nativeEvent
        });
        if (newZone !== undefined && newZone !== currentLocation) {
            onMove(newZone, currentLocation);
        } else {
            _returnToStart();
        }
    };

    const _handleStateChange = (e: PanGestureHandlerStateChangeEvent): void => {
        switch (e.nativeEvent.state) {
            case State.CANCELLED:
            case State.FAILED:
                _returnToStart();
                break;
            case State.END:
                _handleRelease(e);
                break;
            case State.BEGAN:
            case State.ACTIVE:
                onDragStart();
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={e => xy.setValue({x: e.nativeEvent.translationX, y: e.nativeEvent.translationY})}
            onHandlerStateChange={e => {
                console.log(e.nativeEvent);
                _handleStateChange(e);
            }}
        >
            <Animated.View style={{
                transform: [
                    {translateX: xy.x},
                    {translateY: xy.y}
                ],
            }}>
                {children}
            </Animated.View>
        </PanGestureHandler>
    )

};
