import {OverlayProps, OverlayType} from "./types";
import {Animated} from "react-native";

export const getScale = ({timer, overlayType, isPrimary}: OverlayProps): number | Animated.Base => {
    if (!timer) {
        /**
         * drag balls use animated position rather than timer
         */
        return overlayType == OverlayType.DRAGGING ? 1.1 : 1;
    }

    const inputRange = [0, 0.2, 0.8, 1];

    const makeOutput = (minVal: number) => [1, minVal, minVal, 1];

    //immediately invoked function expression (IIFE) pattern
    const outputRange = function ({overlayType, isPrimary}: Pick<OverlayProps, 'overlayType' | 'isPrimary'>) {
        switch (overlayType) {
            case OverlayType.DRAG_SWAP:
                return isPrimary ? [1.1, 1.1, 1, 1] : makeOutput(.75);
            case OverlayType.TAP_SWAP:
                return makeOutput(.75);
            case OverlayType.RETURNING:
                return makeOutput(.9);
            default:
                return makeOutput(1);
        }
    }({overlayType, isPrimary});

    return timer.interpolate({
        inputRange,
        outputRange,
    });
};
