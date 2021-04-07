/**
 * want to be able to show effects on hover over
 * this requires having the position higher up in the tree
 * rather than being held by the currently moving ball
 */

import React from "react";
import {I_Slot, LocatedBall} from "../../state/level/types";
import {useLayout} from "../boxes/LayoutRedux";
import {useLevelSelector} from "../../state";
import {getDropZones, getLocIdMap} from "../../state/level/selectors";
import {useFindDropSlot2} from "./findDropZone";
import {Animated} from "react-native";
import {useActiveBallSlot, useActiveProps} from "./useActiveBall";
import {useDispatch} from "react-redux";
import {movePositionedBall, swapBalls} from "../../state/level/actions";
import {GestureEvents, I_Point, MODE, withNullCallbacks} from "./DragOrTap";
import {PropsWithChildren, useState} from "react";
import {PanTouchableHandler} from "./PanTouchableHandler";

//TODO: zone x/y is relative -- relative to what?  -- also seems to include margin

export const BoxSwapLevelHandler = ({children}: PropsWithChildren<{}>) => {

    /*
    * state:
    * active ball
    * drag position or translation & start position
    */

    const [activeBall, setActiveBall] = useState<LocatedBall | null>(null);

    const [dragTouchPoint, setDragTouchPoint] = useState<I_Point | null>(null);

    const translation = new Animated.ValueXY({x: 0, y: 0});

    /**
     * hooks need to be outside functions
     */
    const dispatch = useDispatch();
    const layout = useLayout(); //TODO: default in case of undefined
    const zones = useLevelSelector(getDropZones);
    const findDropSlot = useFindDropSlot2();
    const locIdMap = useLevelSelector(getLocIdMap);

    const calcTarget = ({x,y}: I_Point): LocatedBall | null => {
        //for any event - click, drag, hover - want to find out what ball is at that position
        const slot = findDropSlot(x, y);
        console.log({slot});
        if ( slot ) {
            const id = (locIdMap[slot.location] || [])[slot.position];
            if ( id ) {
                return {
                    ...slot,
                    currentLocation: slot.location,
                    id
                }
            }
        }
        return null;
    };

    const returnToStart = () => {
        Animated.spring(
            translation,
            {
                toValue: {x: 0, y: 0},
            }
        ).start();
    };

    const onPress = (point: I_Point) => {
        //activate
        //deactivate
        //swap
        const target = calcTarget(point);
        console.log({
            point,
            target,
            activeBall,
        });
        if (target) {
            //select on first tap
            if (activeBall === null) {
                setActiveBall(target)
            }
            //if tapping same ball twice, deselect
            else if (activeBall.id === target.id) {
                setActiveBall(null);
            }
            //when another ball is already active, swap the balls
            else {
                dispatch(swapBalls(activeBall.id, target.id));
                setActiveBall(null);
            }
        }
    };

    const onDragMove = ({x,y}: I_Point): void => {
        translation.setValue({
            x,
            y,
        });
    };

    const onDragRelease = (point: I_Point) => {
        const target = calcTarget(point);
        if ( target && activeBall ) {
            dispatch(swapBalls(activeBall.id, target.id));
            setActiveBall(null);
            setDragTouchPoint(null);
        } else {
            setActiveBall(null);
        }
    };

    const onDragStart = (point: I_Point) => {
        const target = calcTarget(point);
        if ( target ) {
            setActiveBall(target);
            setDragTouchPoint(point);
            translation.setValue({x:0, y:0});
        } else {
            setActiveBall(null);
        }
    };

    const onDragCancel = () => {
        returnToStart();
        setActiveBall(null);
    };

    /*
    * ball props:
    * isDragging
    * isTarget
    * isActive
    */

    const handlers: GestureEvents = {
        onDragMove,
        onPress,
        onDragCancel,
        onDragStart,
        onDragRelease,
    };

    return (
        <PanTouchableHandler {...handlers}>
            {children}
        </PanTouchableHandler>
    )
};
