import {RGB} from "../../util/color-util";
import {LayoutRectangle} from "react-native";

export enum LOCATIONS {
    LEFT,
    RIGHT,
    UNASSIGNED
}

export const createLocationMap = <T>(mapper: (l: LOCATIONS) => T): Record<LOCATIONS, T> => ({
    [LOCATIONS.LEFT]: mapper(LOCATIONS.LEFT),
    [LOCATIONS.RIGHT]: mapper(LOCATIONS.RIGHT),
    [LOCATIONS.UNASSIGNED]: mapper(LOCATIONS.UNASSIGNED),
});

//this is hacky, but I often want to iterate over the enum
export const LOCATIONS_ARRAY: LOCATIONS[] = [LOCATIONS.LEFT, LOCATIONS.RIGHT, LOCATIONS.UNASSIGNED];

export type ZoneId = number | string;
export type DropZoneMap = Record<ZoneId, LayoutRectangle>

export const EMPTY_RECTANGLE: LayoutRectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

export const EMPTY_ZONE_MAP: DropZoneMap = createLocationMap(() => EMPTY_RECTANGLE);

export type LocIdMap = Record<LOCATIONS, number[]>;

export const EMPTY_ID_MAP: LocIdMap = createLocationMap(() => ([]));

/**
 * changeable properties
 */
export interface BallState {
    currentLocation: LOCATIONS;
}

export interface I_Slot {
    location: LOCATIONS,
    position: number,
}

/**
 * the immutable properties
 */
export interface BallData {
    id: number;
    color: RGB;
    correctLocation: LOCATIONS;
    initialLocation: LOCATIONS;
}

export interface BallProps {
    id: number,
    color: RGB,
    currentLocation: LOCATIONS,
    correctLocation: LOCATIONS,
}

export interface LocatedBall {
    id: number;
    position: number;
    currentLocation: LOCATIONS;
}

export const MOVE_BALL = 'MOVE_BALL';
export const SET_LEVEL = 'SET_LEVEL';
export const RESTART = 'RESET_LEVEL';
export const SET_LAYOUT = 'SET_ZONE_LAYOUT';
export const SET_ACTIVE_BALL = 'SET_ACTIVE_BALL';
export const SWAP_BALLS = 'SWAP_BALLS';
export const UNDO = 'UNDO';

interface MoveBallAction {
    type: typeof MOVE_BALL;
    payload: {
        id: number;
        location: LOCATIONS;
        position: number;
    }
}

interface SwapBallAction {
    type: typeof SWAP_BALLS;
    payload: {
        ids: [number, number];
    }
}

interface SetLevelAction {
    type: typeof SET_LEVEL;
    payload: {
        balls: BallData[];
        levelId: number;
    };
    meta: {
        timestamp: number;
    }
}

interface SetLayoutAction {
    type: typeof SET_LAYOUT;
    payload: {
        zoneId: ZoneId,
        layout: LayoutRectangle,
    }
}

interface SetActiveBallAction {
    type: typeof SET_ACTIVE_BALL;
    payload: {
        id: number | null;
    }
}

//would need to store initialLocation somewhere if it's anything other than all unassigned
interface RestartLevelAction {
    type: typeof RESTART;
    meta: {
        timestamp: number;
    }
}

interface UndoAction {
    type: typeof UNDO;
}

export type LevelActionTypes = MoveBallAction | SetLevelAction | RestartLevelAction | SetLayoutAction | SetActiveBallAction | SwapBallAction | UndoAction;
