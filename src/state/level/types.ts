import {Color} from "../../util/color-util";

export enum LOCATIONS {
    LEFT,
    RIGHT,
    UNASSIGNED
}

export type LocIdMap = Partial<Record<LOCATIONS, number[]>>;

/**
 * changeable properties
 */
export interface BallState {
    currentLocation: LOCATIONS;
}

/**
 * the immutable properties
 */
export interface BallData {
    id: number;
    color: Color;
    correctLocation: LOCATIONS;
    initialLocation: LOCATIONS;
}

export interface LocatedBall extends BallData, BallState {
}

export interface BallProps {
    id: number;
    color: Color;

    move(l: LOCATIONS): void;
}

export interface LevelStateReturns {
    isWin: boolean;
    countWrong: number;

    getLocBalls(l: LOCATIONS): BallProps[];
}

export const MOVE_BALL = 'MOVE_BALL';
export const CREATE_NEW_LEVEL = 'CREATE_NEW_LEVEL';
export const SET_LEVEL = 'SET_LEVEL';
export const RESET = 'RESET_LEVEL';

interface MoveBallAction {
    type: typeof MOVE_BALL;
    payload: {
        id: number;
        currentLocation: LOCATIONS;
        newLocation: LOCATIONS;
    }
}

interface CreateNewLevelAction {
    type: typeof CREATE_NEW_LEVEL;
    payload: {
        count: number;
        left: number;
        right: number;
    }
}

interface SetLevelAction {
    type: typeof SET_LEVEL;
    payload: {
        balls: BallData[];
    };
}

//would need to store initialLocation somewhere if it's anything other than all unassigned
interface ResetLevelAction {
    type: typeof RESET;
}

export type LevelActionTypes = MoveBallAction | CreateNewLevelAction | SetLevelAction | ResetLevelAction;