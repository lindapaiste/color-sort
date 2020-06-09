import {COMPLETE_LEVEL, UserActionTypes} from "./types";

export const completeLevel = (level: number, moves: number, time: number): UserActionTypes => ({
    type: COMPLETE_LEVEL,
    payload: {
        level,
        moves,
        time
    },
    meta: {
        timestamp: Date.now(),
    }
});
