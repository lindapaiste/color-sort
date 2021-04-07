import {useEffect} from "react";
import {useReplay} from "../game/useReplay";
import {MenuModalProps} from "./Modal";

/**
 * renderless component that safely calls the hook causing refresh
 * could also do a pop-up asking for confirm
 */
export const Replay = ({close}: MenuModalProps) => {
    const replay = useReplay();
    useEffect( () => {
        replay();
        close();
        }, []
    );
    return null;
};
