import {
    BallData,
    LevelActionTypes,
    LOCATIONS,
    MOVE_BALL,
    SET_ACTIVE_BALL,
    SET_LAYOUT,
    SET_LEVEL,
    SWAP_BALLS, ZoneId
} from "./types";
import {LayoutRectangle} from "react-native";

export const moveBall = (id: number, to: LOCATIONS, from: LOCATIONS): LevelActionTypes => ({
    type: MOVE_BALL,
    payload: {
        id,
        location: to,
        position: 0,
    }
});

export const movePositionedBall = (id: number, location: LOCATIONS, position: number = 0): LevelActionTypes => ({
    type: MOVE_BALL,
    payload: {
        id,
        location,
        position,
    }
});

export const swapBalls = (a: number, b: number): LevelActionTypes => ({
    type: SWAP_BALLS,
    payload: {
        ids: [a, b],
    }
});

export const setLevel = (balls: BallData[], levelId: number = -1): LevelActionTypes => ({
    type: SET_LEVEL,
    payload: {
        balls,
        levelId,
    },
    meta: {
        timestamp: Date.now(),
    }
});

export const setZoneLayout = (zoneId: ZoneId, layout: LayoutRectangle): LevelActionTypes => ({
    type: SET_LAYOUT,
    payload: {
        zoneId,
        layout
    }
});

export const setActiveBall = (id: number | null): LevelActionTypes => ({
    type: SET_ACTIVE_BALL,
    payload: {
        id,
    }
});
