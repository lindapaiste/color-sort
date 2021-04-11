import {LevelBest, LevelVictories, MovesTime, SettingsShape, UserState as State} from "./types";
import {RootState} from "../index";

export const selectLevelBest = (level: number) => (state: RootState): LevelBest => {
    return levelBest(state.user.levelData[level]);
};

/**
 * should not have to individually check every level because they are completed in order
 * can stop as soon as one is incomplete
 * return moves & time keyed by level
 */
export const selectCompletedLevels = (first: number = 0, last: number = 19) => (state: RootState): MovesTime[] => {
    const result: MovesTime[] = [];
    for (let i = first; i <= last; i++) {
        const best = selectLevelBest(i)(state);
        if (best.completed) {
            const {moves, time} = best;
            result[i] = {moves, time};
        } else break;
    }
    return result;
};

const selectRawLevelData = (level: number) => (state: RootState): LevelVictories | undefined => {
    return state.user.levelData[level];
};


//HELPER FUNCTIONS
const isCompleted = (data: LevelVictories | undefined): data is LevelVictories => !!data;

const bestMoves = (data: LevelVictories): number => Math.min(...data.map(v => v.moves));

const bestTime = (data: LevelVictories): number => Math.min(...data.map(v => v.time));

export const levelBest = (data: LevelVictories | undefined): LevelBest => {
    if (isCompleted(data)) {
        return ({
            completed: true,
            moves: bestMoves(data),
            time: bestTime(data),
        })
    } else {
        return ({
            completed: false,
        })
    }
};

//SETTINGS

export const selectAllSettings = (state: RootState): SettingsShape => {
    return state.user.settings;
};

export const selectSetting = <K extends keyof SettingsShape>(setting: K) => (state: RootState): SettingsShape[K] => {
    return state.user.settings[setting];
};
