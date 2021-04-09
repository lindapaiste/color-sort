export interface Victory {
    timestamp: number;
    moves: number;
    time: number;
}

export type LevelVictories = Array<Victory> & { 0: Victory };

//keyed by scales
//value is either a non-empty array or undefined, cannot be an empty array
export type VictoryData = Partial<Record<number, LevelVictories>>;

export type CompleteLevelPayload = Victory & {
    level: number;
}

export interface HasTimestamp {
    timestamp: number;
}

export interface HasMetaTimestamp {
    meta: HasTimestamp;
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

/**
 * can have other sections like preferences, purchases, etc.
 */
export interface UserState {
    levelData: VictoryData,
    settings: SettingsShape,
}
