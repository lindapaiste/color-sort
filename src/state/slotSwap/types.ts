import {LayoutRectangle} from "react-native";
import {BoxSizes, LayoutSettings} from "../../components/boxes/calcSizing";

/**
 * want to store:
 * index of colors & correct boxes for ball id
 * which ball is in each slot
 * dimensions/position of each slot
 * ? which slots are in each box ?
 */

export type ZoneId = number | string;

export const EMPTY_RECTANGLE: LayoutRectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

/**
 * the immutable properties
 */
export interface BallData {
    id: number;
    color: string;
    correctBox: number;
    initialSlot: number;
}

export interface BoxData {
    color: string;
}

export interface LocatedBall {
    id: number;
    slot: number;
}

export interface LevelLayout extends LayoutSettings, Pick<BoxSizes, 'diameter' | 'slotSize' | 'boxPadding'> {
}

export const MOVE_BALL = 'ss_MOVE_BALL';
export const SET_LEVEL = 'ss_SET_LEVEL';
export const RESTART = 'ss_RESET_LEVEL';
export const SET_SLOT_LAYOUT = 'ss_SET_SLOT_LAYOUT';
export const SET_ACTIVE_BALL = 'ss_SET_ACTIVE_BALL';
export const SWAP_BALL_IDS = 'ss_SWAP_BALLS';
export const SWAP_SLOT_BALLS = 'ss_SWAP_SLOTS';
export const UNDO = 'ss_UNDO';
export const SET_LAYOUT = 'ss_SET_LEVEL_LAYOUT';

interface SwapSlotBallAction {
    type: typeof SWAP_SLOT_BALLS;
    payload: {
        slots: [number, number];
    }
}

interface SwapBallAction {
    type: typeof SWAP_BALL_IDS;
    payload: {
        ids: [number, number];
    }
}

interface SetLevelAction {
    type: typeof SET_LEVEL;
    payload: {
        balls: BallData[];
        boxes: BoxData[];
        levelId: number;
    };
    meta: {
        timestamp: number;
    }
}

interface SetLayoutAction {
    type: typeof SET_LAYOUT;
    payload: {
        layout: LevelLayout;
    };
}

interface SetSlotLayoutAction {
    type: typeof SET_SLOT_LAYOUT;
    payload: {
        slot: number,
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

export type LevelActionTypes = SetLevelAction | SetLayoutAction | RestartLevelAction | SetSlotLayoutAction | SetActiveBallAction | SwapBallAction |SwapSlotBallAction| UndoAction;
