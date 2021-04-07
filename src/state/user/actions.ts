import {COMPLETE_LEVEL, SettingsShape, UPDATE_SETTINGS, UserActionTypes} from "./types";

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

export const updateSetting = <K extends keyof SettingsShape>(setting: K, value: SettingsShape[K]): UserActionTypes => ({
   type: UPDATE_SETTINGS,
   payload: {
       setting,
       value,
   }
});
