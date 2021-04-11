import {BallData, BoxData, BoxSwapState as State, LevelLayout, StartLocation} from "./types";
import {last, range} from "lodash";
import {RootState} from "../index";
import {createSelector} from "@reduxjs/toolkit";
import {OverlayData} from "../../components/level-touch/types";

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

const selectLocHistory = (state: RootState) => state.slotSwap.locHistory;

export const selectSlotMap = createSelector(
    selectLocHistory,
    (history) => last(history) || []
);

export const selectMoveCount = (state: RootState): number => {
    return state.slotSwap.stats.moves;
};

export const selectLevelId = (state: RootState): number => {
    return state.slotSwap.stats.levelId;
};

export const selectBallDataMap = (state: RootState) => state.slotSwap.balls;

export const selectSlotDataMap = (state: RootState) => state.slotSwap.slots;

export const selectBoxDataMap = (state: RootState) => state.slotSwap.boxes;

export const selectIsWin = createSelector(
    selectLocHistory,
    selectBallDataMap,
    selectSlotDataMap,
    (history, balls, slots) => {
        const slotMap = last(history) || [];
        return history.length > 1 && slotMap.every(
            (ballId, slotId) => balls[ballId].correctBox === slots[slotId].boxId
        );
    }
);

export const selectLayout = (state: RootState): LevelLayout => {
    return state.slotSwap.layout;
};

export const selectBallsPerBox = createSelector(
    selectLayout,
    ({rowsPerBox, ballsPerRow}) => rowsPerBox * ballsPerRow
);

export const selectBoxCount = (state: RootState): number => state.slotSwap.boxes.length;

export const selectBallCount = (state: RootState): number => state.slotSwap.balls.length;

export const selectPressedSlotId = (state: RootState): number | undefined => state.slotSwap.touch.pressed;

export const selectTouchedSlotId = (state: RootState): number | undefined =>
    state.slotSwap.touch.isTouching ? state.slotSwap.touch.touchStart?.slotId : undefined;

export const selectHoveredSlotId = (state: RootState): number | undefined => state.slotSwap.touch.hoveringOver;

export const selectIsTouching = (state: RootState): boolean => state.slotSwap.touch.isTouching;

export const selectIsDragging = (state: RootState): boolean => state.slotSwap.touch.isDrag;

export const selectOverlayData = (state: RootState): OverlayData[] | undefined => state.slotSwap.touch.overlay;

export const selectTouchStart = (state: RootState): StartLocation | undefined => state.slotSwap.touch.touchStart;

//-------------------------------WITH PROPS--------------------------------------------//

export const selectColorByBallId = (id: number) =>
    (state: RootState): string => {
        return state.slotSwap.balls[id].color;
    };

export const selectColorBySlotId = (slot: number) =>
    (state: RootState): string => {
        const ballId = selectBallIdForSlotId(slot)(state);
        return selectColorByBallId(ballId)(state);
    };

export const selectBoxColorById = (box: number) =>
    (state: RootState): string => {
        return state.slotSwap.boxes[box].color;
    };

export const selectBoxDataById = (box: number) =>
    (state: RootState): BoxData => {
        return state.slotSwap.boxes[box];
    };

export const selectSlotIdsForBoxId = (box: number) =>
    (state: RootState): number[] => {
        const ballsPerBox = selectBallsPerBox(state);
        return range(ballsPerBox * box, ballsPerBox * (box + 1))
    };

export const selectBoxForSlotId = (slot: number) =>
    (state: RootState): number => {
        return state.slotSwap.slots[slot].boxId;
    };

export const selectBallIdForSlotId = (slot: number) =>
    (state: RootState): number => {
        return selectSlotMap(state)[slot];
    };

//returns -1 if not found
export const selectSlotIdForBallId = (id: number) =>
    (state: RootState): number => {
        return selectSlotMap(state).indexOf(id);
    };

export const selectBallDataById = (id: number) =>
    (state: RootState): BallData => {
        return state.slotSwap.balls[id];
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
