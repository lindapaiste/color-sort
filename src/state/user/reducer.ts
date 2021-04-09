import {CompleteLevelPayload, HasTimestamp, SettingsShape, UserState} from "./types";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export const DEFAULT_SETTINGS: SettingsShape = {
    volume: 1,
    isSoundOn: true,
    isShowCheck: true,
    isLockCorrect: false,
};

const initialState: UserState = {
    settings: DEFAULT_SETTINGS,
    levelData: {}
};

export const addTimestamp = <P>(payload: P): P & HasTimestamp => ({
    ...payload,
    timestamp: Date.now(),
});

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        completeLevel: (state, action: PayloadAction<CompleteLevelPayload>) => {
            const {level, ...stats} = action.payload;
            const previous = state.levelData[level];
            if (previous) {
                previous.push(stats);
            } else {
                state.levelData[level] = [stats];
            }
        },
        updateSettings: (state, action: PayloadAction<Partial<SettingsShape>>) => {
            state.settings = {
                ...state.settings,
                ...action.payload
            }
        }
    }
});

export const {completeLevel, updateSettings} = userSlice.actions;
export const reducer = userSlice.reducer;