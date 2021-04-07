import {I_Slot, LOCATIONS} from "../../state/level/types";
import {useLevelSelector} from "../../state";
import {getBallLocation, getDropZones} from "../../state/level/selectors";
import {Animated} from "react-native";
import {
    PanGestureHandler,
    PanGestureHandlerGestureEvent,
    PanGestureHandlerStateChangeEvent,
    State,
    TapGestureHandler
} from "react-native-gesture-handler";
import {findDropZone, useFindDropSlot} from "./findDropZone";
import React, {createRef, PropsWithChildren} from "react";
import {useDispatch} from "react-redux";
import {moveBall, movePositionedBall, swapBalls} from "../../state/level/actions";
import {useActiveBallId, useActiveBallSlot, useActiveProps, useSetActiveBall} from "./useActiveBall";
import {GestureHandlers} from "./GestureHandlers";
import {PanTouchableHandler} from "./PanTouchableHandler";
import {LocatedBall} from "../../state/level/types";

export interface I_Point {
    x: number;
    y: number;
}

export interface I_AbsolutePositioned {
    absoluteX: number;
    absoluteY: number;
}

/**
 * want the functionality to be independent of the libraries or components that I use to implement it
 */
export interface GestureEvents {
    onDragStart: (e: I_Point) => void,
    onDragMove: (e: I_Point) => void,
    onDragRelease: (e: I_Point) => void,
    onDragCancel: (e: I_Point) => void,
    onPress: (e: I_Point) => void,
}

type DragTapLogicProps = { mode: MODE } & Partial<DragCallbacks> & LocatedBall;


export const useDragTapLogic = ({mode, id, currentLocation, position, ...partialCallbacks}: DragTapLogicProps): GestureEvents => {

    const callbacks = withNullCallbacks(partialCallbacks);

    const translation = new Animated.ValueXY({x: 0, y: 0});

    const {isActive, activate, deactivate} = useActiveProps(id);

    const activeBall = useActiveBallSlot();

    const findDropSlot = useFindDropSlot();

    const dispatch = useDispatch();

    const returnToStart = () => {
        Animated.spring(
            translation,
            {
                toValue: {x: 0, y: 0},
            }
        ).start();
        callbacks.onReturn();
    };

    const swapWith = (swapId: number): void => {
        if ( swapId !== id ) {
            dispatch(swapBalls(id, swapId));
            callbacks.onSwap(swapId);
        }
        deactivate(); //technically handled already by redux, but don't want to rely on this
    };

    const moveTo = (newSlot: I_Slot | null | undefined ): void => {
        //will do a move when there is a change in position.  only ignore if position and location both same
        if ( ! newSlot || ( newSlot.location === currentLocation && newSlot.position === position )) {
            returnToStart();
        } else {
            dispatch(movePositionedBall(id, newSlot.location, newSlot.position));
            callbacks.onMove(newSlot.location, currentLocation);
        }
        deactivate(); //technically handled already by redux, but don't want to rely on this
    };

    const onPress = () => {
        //select on first tap
        if (activeBall === null) {
            activate();
            callbacks.onSelect();
        }
        //if tapping same ball twice, deselect
        else if (activeBall.id === id) {
            deactivate();
            callbacks.onDeselect();
        }
        //when another ball is already active, swap the balls
        else if (mode === MODE.SWAP) {
            swapWith(activeBall.id);
        }
        else if (mode === MODE.INDEPENDENT) {
            moveTo(activeBall);
        }
    };

    const onDragStart = (): void => {
      activate();
      callbacks.onDragStart();
    };

    const onDragCancel = (): void => {
        deactivate();
        returnToStart();
    };

    const onDragRelease = ({x, y}: I_Point): void => {
        const newSlot = findDropSlot(x, y);
        console.log({
            newSlot,
            currentLocation,
            x,
            y
        });
        if (mode === MODE.INDEPENDENT) {
            moveTo( newSlot );
        } else if (mode === MODE.SWAP) {
            //TODO: conditional selector swapWith( )
        }
    };

    const onDragMove = ({x,y}: I_Point): void => {
        translation.setValue({
            x,
            y,
        });
    };

    return {
        onDragMove,
        onPress,
        onDragCancel,
        onDragStart,
        onDragRelease,
    }

};



export const BallDragOrTap2 = ({children, ...props}: PropsWithChildren<DragTapLogicProps>) => {
    const eventHandlers = useDragTapLogic(props);
    return (
        <PanTouchableHandler {...eventHandlers}>
            {children}
        </PanTouchableHandler>
    )
};


export interface DragCallbacks {
    onDragStart(): void;
    onReturn(): void;
    onMove(zone: LOCATIONS, previous: LOCATIONS): void;
    onSelect(): void;
    onDeselect(): void;
    onSwap(otherId: number): void;
}

export const withNullCallbacks = ( callbacks: Partial<DragCallbacks> = {} ): Required<DragCallbacks> => {
  return {
      onDragStart: () => {},
      onReturn: () => {},
      onMove: () => {},
      onSelect: () => {},
      onDeselect: () => {},
      onSwap: () => {},
      ...callbacks,
  }
};

export interface BallDragProps {
    currentLocation: LOCATIONS,
    id: number,
}

/**
 * connect to redux to read zone data and execute zone move
 */

export enum MODE {
    INDEPENDENT,
    SWAP,
}

/**
 * now want to separate ball bounce effects from ball animated
 * this wrapper handles moving only
 * but accepts callbacks for control
 */



export const BallDragOrTap = ({
                                  mode, id, children, currentLocation, onMove = () => {
    }, onDragStart = () => {
    }, onReturn = () => {
    }, onSelect = () => {
    },
                                  onDeselect = () => {
                                  },
                                  onSwap = () => {
                                  },
                              }: PropsWithChildren<Partial<DragCallbacks> & { mode: MODE, id: number, currentLocation: LOCATIONS, }>) => {

    const xy = new Animated.ValueXY({x: 0, y: 0});


    const activeId = useActiveBallId();

    const setActiveId = useSetActiveBall();

    const activeBallZone = useLevelSelector(getBallLocation(activeId));

    //make this conditional in case active id was already overwritten by something else
    const deactivate = () => {
        if (activeId === id) {
            setActiveId(null);
        }
    };

    const activate = () => setActiveId(id);

    const zones = useLevelSelector(getDropZones);

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
        else if (mode === MODE.SWAP) {
            if (activeBallZone === null) {
                console.error("cannot execute swap because active ball location is unknown");
                return;
            }
            dispatch(swapBalls(id, activeId));
            onSwap(activeId);
        }
        //TODO: how to handle second tap for independent mode?  needs to be a handler on the drop zone
    };


    const _returnToStart = (): void => {
        deactivate();
        Animated.spring(
            xy,
            {
                toValue: {x: 0, y: 0},
            }
        ).start();
        //callback
        onReturn();
    };

    const _releaseAt = (point: I_AbsolutePositioned): void => {
        if (mode === MODE.INDEPENDENT) {
            const newZone = findDropZone(zones)(point.absoluteX, point.absoluteY);
            console.log({
                zones,
                currentLocation,
                newZone,
                x: point.absoluteX,
                y: point.absoluteY,
            });
            if (newZone !== undefined && newZone !== currentLocation) {
                dispatch(moveBall(id, newZone, currentLocation));
                onMove(newZone, currentLocation);
                deactivate();
            } else {
                _returnToStart();
            }
        } else if (mode === MODE.SWAP) {
            //TODO
        }
    };

    const _handleDragStateChange = (e: PanGestureHandlerStateChangeEvent): void => {
        switch (e.nativeEvent.state) {
            case State.CANCELLED:
            case State.FAILED:
                _returnToStart();
                break;
            case State.END:
                _releaseAt(e.nativeEvent);
                break;
            case State.BEGAN:
            case State.ACTIVE:
                onDragStart();
                activate();
        }
    };

    const _onDragMove = (e: PanGestureHandlerGestureEvent): void => {
        xy.setValue({
            x: e.nativeEvent.translationX,
            y: e.nativeEvent.translationY
        });
    };

    const panRef = createRef<PanGestureHandler>();
    const tapRef = createRef<TapGestureHandler>();

    return (
        <TapGestureHandler
            ref={tapRef}
            simultaneousHandlers={panRef}
            //onHandlerStateChange={}
            onGestureEvent={e => {
                //console.log("tap event");
                //console.log(e);
                _handleTap();
            }}
        >
            <PanGestureHandler
                ref={panRef}
                simultaneousHandlers={tapRef}
                onGestureEvent={e => {
                    //console.log("pan event");
                    //console.log(e);
                    _onDragMove(e);
                }}
                onHandlerStateChange={e => {
                    console.log("pan state change");
                    console.log(e.nativeEvent);
                    _handleDragStateChange(e);
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
        </TapGestureHandler>
    )

};
