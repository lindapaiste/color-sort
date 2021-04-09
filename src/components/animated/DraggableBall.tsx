import {BallProps, LOCATIONS} from "../../state/scale/types";
import {useDispatch} from "react-redux";
import {getDropZones} from "../../state/scale/selectors";
import {Animated} from "react-native";
import {PanGestureHandler, PanGestureHandlerStateChangeEvent, State} from "react-native-gesture-handler";
import {findDropZone} from "./findDropZone";
import {moveBall} from "../../state/scale/actions";
import {colorString} from "../../util/color-util";
import React from "react";
import {useLevelSelector} from "../../state";
/**
 * right now is connecting to redux for select drop zones and dispatch moveBall, but could get these passed down
 */
/**
 * I Love Hue supports BOTH tap start and tap end to move AND animated to move
 */

export interface ChangeZoneCallback {
    ( newZone: LOCATIONS, ball: BallProps ): void,
}

export const ScaleDraggableBall = (props: BallProps) => {
    const dispatch = useDispatch();

    const onChangeZone: ChangeZoneCallback = (newZone, {id, currentLocation}) => {
        dispatch(moveBall(id, newZone, currentLocation));
    };

    return (
        <DraggableBall
            {...props}
            onChangeZone={onChangeZone}
        />
    )
};

export const DraggableBall = ({onChangeZone, ...ballProps}: BallProps & {onChangeZone: ChangeZoneCallback}) => {


    //TODO: diameter prop
    const initialDiameter = 40;

    const {color, currentLocation} = ballProps;

    const zones = useLevelSelector(getDropZones);

    const xy = new Animated.ValueXY({x: 0, y: 0});
    const diameter = new Animated.Value(initialDiameter);


    /**
     * speed: Controls speed of the animation. Default 12.
     * bounciness: Controls bounciness. Default 8.
     */
    const _toLarge = (): void => {
        console.log("bounce large");
        Animated.spring(
            diameter,
            {
                toValue: 1.1 * initialDiameter,
                bounciness: 20,
            }
        ).start();
    };

    const _toSmall = (): void => {
        console.log("bounce in");
        Animated.spring(
            diameter,
            {
                toValue: initialDiameter * .8,
                bounciness: 100,
                speed: 2,
            }
        ).start(_toNormal);
    };

    const _toNormal = (): void => {
        console.log("bounce out");
        Animated.spring(
            diameter,
            {
                toValue: initialDiameter,
                bounciness: 100,
                speed: 20,
            }
        ).start();
    };


    const _returnToStart = (): void => {
        Animated.spring(
            xy,
            {
                toValue: {x: 0, y: 0},
            }
        ).start();
        _toNormal();
    };

    /**
     * ball gets larger when dragging
     * initially wanted it to bounce and end at same size, but can't get 0 delay between in and out.
     *
     * speed: Controls speed of the animation. Default 12.
     * bounciness: Controls bounciness. Default 8.
     */
    const _onStart = (): void => {
        _toLarge();
    };

    const _onRelease = (e: PanGestureHandlerStateChangeEvent): void => {
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
            onChangeZone(newZone, ballProps);
        } else {
            _returnToStart();
        }
    };

    const _onStateChange = (e: PanGestureHandlerStateChangeEvent): void => {
        switch (e.nativeEvent.state) {
            case State.CANCELLED:
            case State.FAILED:
                _returnToStart();
                break;
            case State.END:
                _onRelease(e);
                break;
            case State.BEGAN:
            case State.ACTIVE:
                _onStart();
        }
    };

    return (
        <PanGestureHandler
            onGestureEvent={e => xy.setValue({x: e.nativeEvent.translationX, y: e.nativeEvent.translationY})}
            onHandlerStateChange={e => {
                console.log(e.nativeEvent);
                _onStateChange(e);
            }}
        >
            <Animated.View style={{
                transform: [
                    {translateX: xy.x},
                    {translateY: xy.y}
                ],
                width: diameter,
                height: diameter,
                backgroundColor: colorString(color),
                borderRadius: "50%",
            }}>
            </Animated.View>
        </PanGestureHandler>
    )
};
