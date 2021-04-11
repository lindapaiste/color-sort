import {STATES} from "../animated/useLevelAnimation";
import {RBall} from "../animated/AnimatedBall";
import React, {useEffect, useMemo} from "react";
import {Animated} from "react-native";
import {useSelector} from "../../state";
import {
    selectBallDataById,
    selectBallIdForSlotId,
    selectBoxColorById,
    selectBoxForSlotId,
    selectLayout,
    selectOverlayData,
    selectPressedSlotId
} from "../../state/slotSwap/selectors";
import {selectSetting} from "../../state/user/selectors";
import {useBounce} from "../level-touch/useBounce";
import {CRegisteredSlot} from "../level-touch/RegisteredSlot";

export interface CProps {
    slot: number;
    winEffectTiming: Animated.Value;
    loadInTiming: Animated.Value;
    state: STATES;
}

/**
 * some information could be passed down rather then read from redux
 * for example, isCorrect depends on knowing the box, which can be inferred from slot but is already known
 * fade to box color requires box color
 */

export interface RProps {
    slot: number;
    winEffectTiming: Animated.Value;
    loadInTiming: Animated.Value;
    color: string;
    diameter: number;
    slotSize: number;
    isCheck: boolean;
    isOverlay: boolean;
    isPressed: boolean;
    boxColor: string;
}

export const CSlotBall = ({slot, winEffectTiming, loadInTiming, state}: CProps) => {

    const {diameter, slotSize} = useSelector(selectLayout);
    const ballId = useSelector(selectBallIdForSlotId(slot));
    const {color, correctBox} = useSelector(selectBallDataById(ballId));
    const boxId = useSelector(selectBoxForSlotId(slot));
    const boxColor = useSelector(selectBoxColorById(boxId));
    const isCorrect = correctBox === boxId;
    const isShowCheck = useSelector(selectSetting('isShowCheck'));
    const isCheck = isCorrect && isShowCheck;
    const isPressed = useSelector(state => selectPressedSlotId(state) === slot);
    const isOverlay = useSelector(state => selectOverlayData(state)?.some(d => d.slot === slot));

    const bouncyScale = useBounce(isPressed);

    console.log("ball re-rendered");

    const scale = useMemo(() => {
        console.log("calculating scale");
        return state === STATES.LOADING_IN ? loadInTiming.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        }) : state === STATES.PLAYING ? bouncyScale
            : winEffectTiming.interpolate({
                inputRange: [0, .5, 1],
                outputRange: [1, slotSize / diameter, slotSize / diameter],
            });
    }, [state, loadInTiming, winEffectTiming, bouncyScale, slotSize, diameter]);

    const borderRadius = useMemo(() =>
            winEffectTiming.interpolate({
                inputRange: [0, .5, 1],
                outputRange: [.5, 0, 0],
            }),
        [winEffectTiming]
    );

    const animatedColor = useMemo(() =>
        winEffectTiming.interpolate({
            inputRange: [0, .5, 1],
            outputRange: [color, boxColor, boxColor],
        }),
        [winEffectTiming]
    );

    useEffect(() => console.log("load in Timing Change"), [loadInTiming]);

    return (
        <CRegisteredSlot slot={slot}>
            <RBall
                color={animatedColor}
                diameter={diameter}
                isCheck={isCheck && state === STATES.PLAYING}
                scale={scale}
                opacity={isOverlay ? 0 : 1}
                borderRadius={borderRadius}
            />
        </CRegisteredSlot>
    )

};
