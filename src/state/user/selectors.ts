import {StateShape as State} from "./reducer";
import {MovesTime, LevelBest, LevelVictories, SettingsShape} from "./types";

export const getLevelBest = (level: number) => (state: State): LevelBest => {
    return levelBest( state.levelData[level] );
};

/**
 * should not have to individually check every scales because they are completed in order
 * can stop as soon as one is incomplete
 * return moves & time keyed by scales
 */
export const getCompletedLevels = (first: number = 0, last: number = 19) => (state: State): MovesTime[] => {
    const result: MovesTime[] = [];
    for ( let i = first; i <= last; i++ ) {
        const best = getLevelBest(i)(state);
        if ( best.completed ) {
            const {moves, time} = best;
            result[i] = {moves, time};
        }
        else break;
    }
    return result;
};

const getRawLevelData = (level: number) => (state: State): LevelVictories | undefined => {
    return state.levelData[level];
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

export const getAllSettings = (state: State): SettingsShape => {
    return state.settings;
};

export const getSetting = <K extends keyof SettingsShape>(setting: K) => (state: State): SettingsShape[K] => {
    return state.settings[setting];
};
