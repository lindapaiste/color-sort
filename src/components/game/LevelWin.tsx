import {FromGetStats, FromLevelWin, RenderWin} from "./RenderWin";
import {useLevelSelector} from "../../state";
import {useDispatch} from "react-redux";
import React, {useEffect} from "react";
import {completeLevel} from "../../state/user/reducer";

/**
 * dispatches completion of the level to redux
 * generates functions for replay and next level based on passed down playLevel function
 */
export const LevelWin = ({id, getStats, ...rest}: { id: number, getStats: () => FromGetStats } & FromLevelWin) => {
    const {startTime, moves} = useLevelSelector(state => state.stats);

    //TODO: needs to be in state or something
    const time = Date.now() - startTime;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(completeLevel({
            moves,
            timestamp: Date.now(),
            time: Date.now() - startTime,
            level: id,
        }));
    }, [id]);

    const stats = getStats(); //might involve hook calls

    return (
        <RenderWin
            {...stats}
            {...rest} //onPressReplay, onPressNext, hasNext
            moves={moves}
            time={time}
        />
    );
};
