import {BallData, LevelActionTypes, LOCATIONS, MOVE_BALL, SET_LEVEL} from "./types";

export const moveBall = (id: number, to: LOCATIONS, from: LOCATIONS): LevelActionTypes => ({
    type: MOVE_BALL,
    payload: {
        id,
        currentLocation: from,
        newLocation: to,
    }
});

export const setLevel = (balls: BallData[]): LevelActionTypes => ({
    type: SET_LEVEL,
    payload: {
        balls
    }
});