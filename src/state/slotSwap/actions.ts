import {
    BallData, BoxData, LevelLayout,
    LevelActionTypes,
    SET_ACTIVE_BALL,
    SET_LEVEL, SET_SLOT_LAYOUT,
    SWAP_BALL_IDS, SWAP_SLOT_BALLS, ZoneId, SET_LAYOUT
} from "./types";
import {LayoutRectangle} from "react-native";

export const swapBallIds = (a: number, b: number): LevelActionTypes => ({
    type: SWAP_BALL_IDS,
    payload: {
        ids: [a, b],
    }
});

export const swapSlotBalls = (a: number, b: number): LevelActionTypes => ({
    type: SWAP_SLOT_BALLS,
    payload: {
        slots: [a, b],
    }
});

export const setLevelBalls = (balls: BallData[], boxes: BoxData[], levelId: number = -1): LevelActionTypes => ({
    type: SET_LEVEL,
    payload: {
        balls,
        boxes,
        levelId,
    },
    meta: {
        timestamp: Date.now(),
    }
});

export const setLevelLayout = (layout: LevelLayout): LevelActionTypes => ({
   type: SET_LAYOUT,
    payload: {
       layout,
    }
});

export const setSlotLayout = (slot: number, layout: LayoutRectangle): LevelActionTypes => ({
    type: SET_SLOT_LAYOUT,
    payload: {
        slot,
        layout
    }
});

export const setActiveBall = (id: number | null): LevelActionTypes => ({
    type: SET_ACTIVE_BALL,
    payload: {
        id,
    }
});
