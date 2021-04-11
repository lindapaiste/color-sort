import {SlotFinder} from "./types";
import {useLayout} from "../boxes/LayoutRedux";
import {useRegisteredSlots} from "./ControllerContext";
import {findIsInCircle} from "./calc";

export const useFindTargetC = (): SlotFinder => {
    const {slotSize, diameter} = useLayout();
    const slots = useRegisteredSlots();

    return findIsInCircle(slotSize, diameter)(slots);
};

