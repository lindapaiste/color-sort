import {Animated} from "react-native";
import {useBounce} from "./useBounce";
import {ControllerSlotProps} from "./types";

export interface Props extends Partial<ControllerSlotProps> {
    color: string;
    diameter: number;
    scale?: Animated.Value | number;
    isPressed?: boolean;
    isDragging?: boolean;
    isSwapping?: boolean;
    isCheck?: boolean;
    isHint?: boolean;
}

/**
 * want to be able to repeat certain effects, for example use the same indefinite bounce on isPressed and isHint
 */
export const useBallStyle = ({color, diameter, isPressed = false, isCheck = false, isDragging = false, isSwapping = false, isHint = false, scale: passedScale = 1}: Props) => {

    const scale = useBounce(isPressed || isHint);

    const opacity = isSwapping ? 0 : 1;
};


