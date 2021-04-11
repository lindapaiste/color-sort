import React, {PropsWithChildren} from "react";
import {LOCATIONS} from "../../state/scale/types";
import {Animated, View} from "react-native";
import {useActiveBallId, useSetActiveBall} from "./useActiveBall";
import {__useLevelSelector} from "../../state";
import {getBallLocation} from "../../state/scale/selectors";
import {useDispatch} from "react-redux";
import {moveBall, swapBalls} from "../../state/scale/actions";
import {TapGestureHandler} from "react-native-gesture-handler";
import {DragCallbacks, MODE} from "./DragOrTap";
import {TouchableHighlight} from "react-native";

export const TapOnly = ({
                                  mode, id, children, currentLocation, onMove = () => {
    }, onSelect = () => {
    },
                                  onDeselect = () => {
                                  },
                                  onSwap = () => {
                                  },
                              }: PropsWithChildren<DragCallbacks & { mode: MODE, id: number, currentLocation: LOCATIONS, }>) => {

    const activeId = useActiveBallId();

    const setActiveId = useSetActiveBall();

    const activeBallZone = __useLevelSelector(getBallLocation(activeId));

    //make this conditional in case active id was already overwritten by something else
    const deactivate = () => {
        if (activeId === id) {
            setActiveId(null);
        }
    };

    const activate = () => setActiveId(id);

    const dispatch = useDispatch();

    const _handleTap = () => {
        //select on first tap
        if (activeId === null) {
            activate();
            onSelect();
        }
        //if tapping same ball twice, deselect
        else if (activeId === id) {
            deactivate();
            onDeselect();
        }
        //when another ball is already active, swap the balls
        else {
            if (activeBallZone === null) {
                console.error("cannot execute swap because active ball location is unknown");
                return;
            }
            if (mode === MODE.SWAP) {
                dispatch(swapBalls(id, activeId));
                onSwap(activeId);
            } else if ( mode === MODE.INDEPENDENT ) {
                dispatch(moveBall(activeId, currentLocation, activeBallZone));
                //onChangeZone() expects to be for the current ball, but we are moving the active ball
            }
        }
        //TODO: how to handle second tap for independent mode?  needs to be a handler on the drop zone
    };

    return (
        <TouchableHighlight
            //onHandlerStateChange={}
            onPress={e => {
                console.log("press event");
                console.log(e);
                _handleTap();
            }}
        >
            <View>
                    {children}
            </View>
        </TouchableHighlight>
    )

};
