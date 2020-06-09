import {StateShape as State} from "./reducer";
import {CompletedLevelBest, LevelBest, LevelVictories} from "./types";

export const getLevelBest = (level: number) => (state: State): LevelBest => {
    const raw = state.levelData[level];
    if (isCompleted(raw)) {
        return ({
            completed: true,
            moves: bestMoves(raw),
            time: bestTime(raw),
        })
    } else {
        return ({
            completed: false,
        })
    }
};

/**
 * should not have to individually check every level because they are completed in order
 * can stop as soon as one is incomplete
 * return moves & time keyed by level
 */
export const getCompletedLevels = (first: number = 1, last: number = 20) => (state: State): CompletedLevelBest[] => {
    const result: CompletedLevelBest[] = [];
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
