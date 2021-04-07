import {useCallback, useState} from "react";
import {replaceIndex} from "../../util/array-edit";
import {LayoutChangeEvent} from "react-native";
import {CompleteSlot, PageLocation, RegisteredSlot} from "./types";

export const useSlotRegistry = () => {
    const [slotAreas, setSlotAreas] = useState<Array<RegisteredSlot | undefined>>([]);

    const registerSlot = useCallback( (id: number, location: PageLocation, disabled: boolean = false): void => {
        setSlotAreas(prevState => replaceIndex(prevState, id, {...location, disabled}));
    }, []);

    const disableSlot = useCallback((id: number, disabled: boolean = true): void => {
        setSlotAreas(prevState => {
            const existing = prevState[id];
            if (existing === undefined) {
                console.error(`cannot disable slot id #${id} because it is undefined`);
                return prevState;
            }
            return replaceIndex(prevState, id, {
                ...existing,
                disabled,
            })
        })
    }, []);

    const unregisterSlot = useCallback( (id: number): void => {
        //want to preserve indexes, so set to undefined rather than removing
        setSlotAreas(replaceIndex(slotAreas, id, undefined));
    }, []);

    const clear = useCallback((): void => {
        //unregisters everything
        setSlotAreas([]);
    }, []);

    const registerOnLayout = useCallback( (id: number, disabled?: boolean) => (e: LayoutChangeEvent): void => {
        console.log(e);
        registerSlot(id, {
                pageX: e.nativeEvent.layout.x,
                pageY: e.nativeEvent.layout.y
            },
            disabled);
    }, [registerSlot]);

    const getSlot = useCallback((slot: number): CompleteSlot | undefined => {
        const registered = slotAreas[slot];
        if (registered !== undefined) {
            return {
                ...registered,
                slot,
            }
        }
    }, [slotAreas]);

    return {
        registerSlot,
        unregisterSlot,
        clear,
        registerOnLayout,
        getSlot,
        slotAreas,
    }
};
