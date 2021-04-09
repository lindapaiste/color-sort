import {BallData, BoxData, LevelLayout, BoxSwapState as State, SlotMap} from "./types";
import {last, range} from "lodash";

/**
 * what really matters are the selectors and the action creators
 * the state can have any shape as long as can select the right data from it
 *
 * going to need to map/lookup somewhere (or else duplicate data)
 * need to both select balls for a location
 * and check all balls in all locations for correctness
 *
 * can store locations separately or currentLocation as part of balls data
 */

//----------------------------------WITHOUT PROPS-----------------------------------------//

export const getIsWin = (state: State): boolean => {
    //.every() is faster because can stop as soon as any are incorrect
    return state.stats.moves > 0 && getSlotMap(state).every((_, slot) => getIsSlotCorrect(slot)(state))
};

export const getCountWrong = (state: State): number => {
    return getWrongIds(state).length;
};

export const getWrongIds = (state: State): number[] => {
    return getSlotMap(state).filter((_, slot) => !getIsSlotCorrect(slot)(state));
};

export const getMoveCount = (state: State): number => {
    return state.stats.moves;
};

export const getElapsedTime = (state: State): number => {
    return Date.now() - state.stats.startTime;
};

export const getLayout = (state: State): LevelLayout => {
    return state.layout;
};

export const getBallsPerBox = (state: State): number => {
    const {rowsPerBox, ballsPerRow} = getLayout(state);
    return rowsPerBox * ballsPerRow;
};

export const getSlotMap = (state: State): SlotMap => {
    return last(state.locHistory) || [];
};

export const getLevelId = (state: State): number => {
    return state.stats.levelId;
};

//-------------------------------WITH PROPS--------------------------------------------//

export const getSlotProps = (slot: number) =>
    (state: State) => {
        const boxId = getSlotBox(slot)(state);
        const boxColor = getBoxColor(boxId)(state);
        const ballId = getSlotBallId(slot)(state);
        const {correctBox, color} = getBallData(ballId)(state);
        const isCorrect = correctBox === boxId;

        return {
            isCorrect,
            boxColor,
            boxId,
            ballId,
            color,
        }
    };

export const getIsSlotCorrect = (slot: number) =>
    (state: State): boolean => {
        const box = getSlotBox(slot)(state);
        const ball = getSlotBallId(slot)(state);
        const correct = getBallData(ball)(state).correctBox;
        return correct === box;
    };

export const getBallColor = (id: number) =>
    (state: State): string => {
        return state.balls[id].color;
    };

export const getSlotColor = (slot: number) =>
    (state: State): string => {
        const ballId = getSlotBallId(slot)(state);
        return getBallColor(ballId)(state);
    };

export const getBoxColor = (box: number) =>
    (state: State): string => {
        return state.boxes[box].color;
    };

export const getBox = (box: number) =>
    (state: State): BoxData => {
        return state.boxes[box];
    };

export const getBoxSlots = (box: number) =>
    (state: State): number[] => {
        const ballsPerBox = getBallsPerBox(state);
        return range(ballsPerBox * box, ballsPerBox * (box + 1))
    };

export const getSlotBox = (slot: number) =>
    (state: State): number => {
        const ballsPerBox = getBallsPerBox(state);
        return Math.floor(slot / ballsPerBox);
    };

export const getSlotBallId = (slot: number) =>
    (state: State): number => {
        return getSlotMap(state)[slot];
    };

//returns -1 if not found
export const getBallSlot = (id: number) =>
    (state: State): number => {
        return getSlotMap(state).indexOf(id);
    };

export const getBallData = (id: number) =>
    (state: State): BallData => {
        return state.balls[id];
    };

//-------------------------------HELPER--------------------------------------------//

export const isValidSlot = (slot: number) =>
    (state: State): boolean => {
        return state.slots[slot] !== undefined;
    };

export const isValidBall = (id: number) =>
    (state: State): boolean => {
        return state.balls[id] !== undefined;
    };

export const getBoxIndexes = (state: State): number[] => {
  return [...state.boxes.keys()];
};

export const getSlotIndexes = (state: State): number[] => {
  return [...getSlotMap(state).keys()];
};
