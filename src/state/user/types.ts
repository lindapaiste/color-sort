export interface Victory {
    timestamp: number;
    moves: number;
    time: number;
}

export type LevelVictories = Array<Victory> & {0: Victory};

//keyed by level
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

export type UserActionTypes = CompleteLevelAction

export interface CompletedLevelBest {
    moves: number;
    time: number;
}

export type LevelBest = {
    completed: true;
} & CompletedLevelBest | {
    completed: false;
}
