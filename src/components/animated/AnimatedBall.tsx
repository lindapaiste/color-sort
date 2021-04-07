import React, {PropsWithChildren, useRef} from "react";
import {Animated} from "react-native";
import {BallDragOrTap2, MODE} from "./DragOrTap";
import {I_Slot, LocatedBall} from "../../state/level/types";
import {styles} from "../../ui/styles";
import {AntDesign as Icon} from "@expo/vector-icons";
import {RBallSlot} from "../boxes/BallSlot";

/**
 * multiple effects can alter the diameter, such as fadeOut, dragStart, hover, etc.
 * fadeOut applies to all balls, while others are just for the specific ball
 */

/**
 * note: native animations should be used for CSS properties but not layout properties
 * so animate transform: scale rather than height and width
 */

export interface Props {
    color: Animated.Base | string;
    diameter: number;
    scale?: Animated.Base | number;
    opacity?: Animated.Base | number;
    borderRadius?: Animated.Base | number;  //ranges from 0 to .5 where 0 is square and .5 is circle
}

export const RBallParent = ({color, diameter, scale = 1, opacity = 1, borderRadius = .5, children}: PropsWithChildren<Props>) => {
    return (
        <Animated.View
            style={[
                styles.centerContents,
                {
                    borderRadius: Animated.multiply(borderRadius, diameter), //use interpolate instead?
                    backgroundColor: color,
                    transform: [{
                        scale
                    }],
                    width: diameter,
                    height: diameter,
                    opacity,
                }
            ]}
            children={children}
        />
    )
};

export const RBall = ({isCheck = false, ...props}: Props & {isCheck?: boolean}) => {
    return (
        <RBallParent {...props}>
            {isCheck &&
                <Icon name={"check"} color={"white"}/>
            }
        </RBallParent>
    )
};


export interface MoveableBallProps  extends  Props, LocatedBall {
    id: number,
    slotSize: number,
    isHint?: boolean,
    isCheck?: boolean,
}

export const MoveableBall = ({color, diameter, scale = 1, borderRadius, slotSize, currentLocation, position, id, isCheck = false, isHint = false}: MoveableBallProps) => {

    const diameterAdjust = useRef(new Animated.Value(1)).current;

    //creates the spring animation but does not start it
    const springDiameter = (toValue: number, config: Omit<Animated.SpringAnimationConfig, 'toValue'> = {}) =>
        Animated.spring(diameterAdjust, {
            ...config,
            toValue,
            useNativeDriver: true,
        });

    const onDragStart = () => springDiameter(1.2).start();

    const onSelect = () => {
        Animated.sequence([
            Animated.spring(diameterAdjust, {
                toValue: .8,
                useNativeDriver: true,
            }),

            Animated.spring(diameterAdjust, {
                toValue: 1.4,
                useNativeDriver: true,
            }),

            Animated.spring(diameterAdjust, {
                toValue: 1.15,
                useNativeDriver: true,
            })
        ]).start();
    };

    return (
        <RBallSlot
            slotSize={slotSize}
        >

                <RBall
                    color={color}
                    diameter={diameter}
                    scale={scale}
                    //scale={Animated.multiply(scale, diameterAdjust)}
                    borderRadius={borderRadius}
                    isCheck={isCheck}
                />
        </RBallSlot>
    )
};
/*
            <BallDragOrTap2
                id={id}
                currentLocation={currentLocation}
                position={position}
                onDragStart={() => springDiameter(1.2).start()}
                onReturn={() => springDiameter(1).start()}
                onMove={() => springDiameter(1).start()}
                onSwap={console.log}
                onDeselect={() => springDiameter(1).start()}
                onSelect={onSelect}
                mode={MODE.SWAP}
            >
                <RenderBall
                    color={color}
                    diameter={diameter}
                    scale={scale}
                    //scale={Animated.multiply(scale, diameterAdjust)}
                    borderRadius={borderRadius}
                    isCheck={isCheck}
                />
            </BallDragOrTap2>
 */
