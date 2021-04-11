import {useDispatch} from "react-redux";
import {setActiveBall} from "../../state/scale/actions";
import {__useLevelSelector} from "../../state";
import {getActiveBall, getBallSlot} from "../../state/scale/selectors";
import {I_Slot, LOCATIONS} from "../../state/scale/types";

export interface ActiveProps {
    isActive: boolean,
    activate(): void,
    deactivate(): void,
}

/**
 * want these two hooks to be the signature even if I change how it is stored
 */
export const useActiveBallId = (): number | null => {
    return __useLevelSelector(getActiveBall);
};
export const useSetActiveBall = (): (id: number | null) => void => {
    const dispatch = useDispatch();
    return (id) => dispatch(setActiveBall(id));
};

export const useActiveBallSlot = (): (I_Slot & {id: number})  | null => {
    const id = useActiveBallId();
    const slot = __useLevelSelector(getBallSlot(id));

    if (id === null || slot === null) {
        return null;
    } else return {
            ...slot,
            id
    }
};

export const useActiveProps = (id: number): ActiveProps => {
    const activeId = useActiveBallId();

    const setActiveId = useSetActiveBall();

    const isActive = activeId === id;

    //make this conditional in case active id was already overwritten by something else
    const deactivate = () => {
        if (isActive) {
            setActiveId(null);
        }
    };

    const activate = () => setActiveId(id);

    return {
        isActive,
        activate,
        deactivate,
    }
};
