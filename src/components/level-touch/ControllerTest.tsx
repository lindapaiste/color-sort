import {useBounce} from "./useBounce";
import {RRegisteredSlot} from "./RegisteredSlot";
import {RBallParent} from "../animated/AnimatedBall";
import React, {useCallback, useRef, useState} from "react";
import {colorString, createRandom} from "../../util/color-util";
import {swapIndexes} from "../../util/array-edit";
import {View} from "react-native";
import {ROverlayPosition} from "./OverlayPosition";
import {RBasicBall} from "./BasicBall";
import {SwapController} from "./SwapController";
import {range} from "lodash";
import {ExecuteSwap, SlotArray} from "./types";
import {useGetSlotProps, useRegisterSlot} from "./ControllerContext";
import {getScale} from "./getOverlayScale";
import {findIsInCircle} from "./calc";

//TODO: needs own ControllerContext Provider
export const Tester = () => {

    const diameter = 50;
    const slotSize = 60;

    const balls = useRef(range(0, 30).map(createRandom).map(colorString));

    const [slots, setSlots] = useState(balls.current.map((_, i) => i));

    const getBallColor = (id: number) => balls.current[id];

    const getSlotColor = (slot: number) => {
        const ballId = slots[slot];
        return getBallColor(ballId);
    };

    const executeSwap: ExecuteSwap = (a, b) => {
        setSlots(swapIndexes(slots, a, b));
    };

    const findTarget = useCallback(
        (x: number, y: number, slots: SlotArray) => findIsInCircle(slotSize, diameter)(slots)(x, y),
        [slotSize, diameter]
    );

    return (
        <>
            <View
                style={{
                    marginLeft: 50,
                }}
            >
                <SwapController
                    executeSwap={executeSwap}
                    findTarget={findTarget}
                    RenderOverlayBall={props => (
                        <ROverlayPosition {...props}>
                            <RBasicBall
                                color={getSlotColor(props.slot)}
                                slotSize={slotSize}
                                diameter={diameter}
                                scale={getScale(props)}
                            />
                        </ROverlayPosition>
                    )}
                >
                    <View
                        style={{
                            display: "flex",
                            flexWrap: "wrap",
                            flexDirection: "row",
                        }}
                    >
                        {slots.map((ballId, slot) => (
                            <TesterBall
                                key={slot}
                                color={getBallColor(ballId)}
                                diameter={diameter}
                                slotSize={slotSize}
                                slot={slot}
                            />
                        ))}
                    </View>
                </SwapController>
            </View>
        </>
    )

};
const TesterBall = ({slotSize, diameter, color, slot}: { slotSize: number, diameter: number, color: string, slot: number }) => {
    const {isSwapping, isPressed, isDragging, isOverlay} = useGetSlotProps(slot);
    const scale = useBounce(isPressed);
    return (
        <RRegisteredSlot
            slotSize={slotSize}
            register={useRegisterSlot()}
            slot={slot}
        >
            <RBallParent
                color={color}
                opacity={(isOverlay) ? 0 : 1}
                scale={scale /*activateTimer.interpolate({
                                            inputRange: [0, .25, .75, 1],
                                            outputRange: isPressed ? [1, .8, 1.2, 1] : [1, 1, 1, 1],
                                            //inputRange: [0, 0.3, 0.6, 0.8, 1],
                                            //outputRange: [1, 0.75, 1.2, 1, .9]
                                        })*/}
                diameter={diameter}
            />
        </RRegisteredSlot>
    )
};
