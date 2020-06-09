import {COMPLETE_LEVEL, VictoryData, UserActionTypes} from "./types";
import {combineReducers} from "redux";

export const levelData = (state: VictoryData = {}, action: UserActionTypes): VictoryData => {
    switch ( action.type ) {
        case COMPLETE_LEVEL:
            const {level, moves, time} = action.payload;
            const {timestamp} = action.meta;
            const previous = state[level] || [];
            return {
                ...state,
                [level]: [
                    {
                        moves,
                        time,
                        timestamp,
                    }, //put the newest first because of typescript, where we require index 0 to be set
                    ...previous,
                ]
            };
        default:
            return state;
    }
};

/**
 * can have other sections like preferences, purchases, etc.
 */

export interface StateShape {
    levelData: VictoryData,
}

export const reducer = combineReducers({
    levelData,
});
