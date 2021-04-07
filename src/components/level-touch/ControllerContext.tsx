import {ControllerSlotProps, PageLocation} from "./types";
import {createContext, useContext} from "react";
import {SlotArray} from "./types";
import {RegisterFunction} from "./types";

/**
 * need to get the props for the overlayed balls from the controller
 * want to leave interpolation ranges, etc. up to the render function
 * should drag, tap swap, drag swap be handled differently?
 */

export interface ControllerContextValue {
    slots: SlotArray;

    getSlotProps(slot: number): ControllerSlotProps;

    registerSlot(slot: number, location: PageLocation): void;
}

export const ControllerContext = createContext<ControllerContextValue>({
    slots: [],
    getSlotProps: () => ({
        isDragging: false,
        isPressed: false,
        isSwapping: false,
        isOverlay: false,
    }),
    registerSlot: () => {
        console.error("attempting to register slot outside of ControllerContext provider");
    },
});

export const useRegisteredSlots = (): SlotArray => {
    return useContext(ControllerContext).slots;
};

export const useRegisterSlot = (): RegisterFunction => {
    return useContext(ControllerContext).registerSlot;
};

export const useGetSlotProps = (slot: number): ControllerSlotProps => {
    return useContext(ControllerContext).getSlotProps(slot);
};
