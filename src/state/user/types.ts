export interface Victory {
    timestamp: number;
    moves: number;
    time: number;
}

export type LevelVictories = Array<Victory> & {0: Victory};

//keyed by scales
//value is either a non-empty array or undefined, cannot be an empty array
export type VictoryData = Partial<Record<number, LevelVictories>>;

export const COMPLETE_LEVEL = "COMPLETE_LEVEL";

interface CompleteLevelAction {
    type: typeof COMPLETE_LEVEL;
    payload: {
        level: number;
        moves: number;
        time: number;
    };
    meta: {
        timestamp: number;
    }
}

export interface MovesTime {
    moves: number;
    time: number;
}

export type LevelBest = {
    completed: true;
} & MovesTime | {
    completed: false;
}


export interface SettingsShape {
    volume: number;
    isSoundOn: boolean;
    isShowCheck: boolean;
    isLockCorrect: boolean;
}

export const UPDATE_SETTINGS = "UPDATE_SETTINGS";

interface UpdateSettingsAction {
    type: typeof UPDATE_SETTINGS;
    payload: {
        setting: keyof SettingsShape;
        value: SettingsShape[keyof SettingsShape];
    };
}

export type UserActionTypes = CompleteLevelAction | UpdateSettingsAction;
