import {combineReducers} from "redux";
import {
    BallData,
    BoxData,
    LevelActionTypes,
    LevelLayout,
    RESTART,
    SET_ACTIVE_BALL, SET_LAYOUT,
    SET_LEVEL,
    SET_SLOT_LAYOUT,
    SWAP_BALL_IDS,
    SWAP_SLOT_BALLS,
    UNDO
} from "./types";
import {keyBy, last} from "lodash";
import {replaceIndex, swapIndexes} from "../../util/array-edit";
import {LayoutRectangle} from "react-native";

export type SlotMap = Array<number>;

export const nextLocations = (state: SlotMap = [], action: LevelActionTypes): SlotMap => {
    switch (action.type) {
        case SWAP_BALL_IDS:
            //could use swap indexes if passing the slot in the action
            const [a, b] = action.payload.ids;
            return state.map(id => id === a ? b : id === b ? a : id);
        case SWAP_SLOT_BALLS:
            const [i, j] = action.payload.slots;
            return swapIndexes(state, i, j);
        default:
            return state;
    }
};

export type HistoryShape = Array<SlotMap>;

export const locHistory = (state: HistoryShape = [], action: LevelActionTypes): HistoryShape => {
    switch (action.type) {
        case RESTART:
            return state.slice(0, 1);
        case UNDO:
            return state.slice(0, -1);
        case SET_LEVEL:
            const {balls} = action.payload;
            const map = balls.reduce((map, ball) => replaceIndex(map, ball.initialSlot, ball.id), [] as SlotMap);
            return [map];
        case SWAP_BALL_IDS:
        case SWAP_SLOT_BALLS:
            const current = last(state);
            if (current === undefined) {
                console.error("cannot move or swap balls on an empty history");
                return state;
            }
            return [
                ...state,
                nextLocations(current, action),
            ];
        default:
            return state;
    }
};

export type SlotLayoutShape = Array<LayoutRectangle>;

export const slots = (state: SlotLayoutShape = [], action: LevelActionTypes): SlotLayoutShape => {
    switch (action.type) {
        case SET_SLOT_LAYOUT:
            const {slot, layout} = action.payload;
            return replaceIndex(state, slot, layout);
        default:
            return state;
    }
};

export type BoxesShape = BoxData[];

export const boxes = (state: BoxesShape = [], action: LevelActionTypes): BoxesShape => {
    switch (action.type) {
        case SET_LEVEL:
            return action.payload.boxes;
        default:
            return state;
    }
};

//key by id for easy lookup, but also keep the id as a property for easy mapping
export type BallsShape = Record<number, BallData>;

export const balls = (state: BallsShape = {}, action: LevelActionTypes): BallsShape => {
    switch (action.type) {
        case SET_LEVEL:
            const {balls} = action.payload;
            /*const newState: BallsShape = {};
            balls.forEach( ball => {
                const {id, color, correctLocation, initialLocation} = ball;
                newState[id] = {
                    color,
                    correctLocation,
                    initialLocation,
                }
            });
            return newState;*/
            return keyBy(balls, b => b.id); //TODO: check key is number not string
        default:
            return state;

    }
};

export interface StatsShape {
    startTime: number,
    moves: number,
    levelId: number,
}

export const stats = (state: StatsShape = {
    startTime: 0,
    moves: 0,
    levelId: -1
}, action: LevelActionTypes): StatsShape => {
    switch (action.type) {
        //want to only count it as a move if the location has changed, ignoring changes to position
        //but this info is not currently included in the action
        case SWAP_BALL_IDS:
        case SWAP_SLOT_BALLS:
            return {
                ...state,
                moves: state.moves + 1,
            };
        case SET_LEVEL:
            return {
                startTime: action.meta.timestamp,
                levelId: action.payload.levelId,
                moves: 0,
            };
        case RESTART:
            return {
                ...state,
                startTime: action.meta.timestamp,
                moves: 0,
            };
        case UNDO:
            return {
                ...state,
                moves: Math.min(0, state.moves - 1), //in case of undo on 0 moves
            };
        default:
            return state;
    }
};

export type ActiveShape = number | null;

export const active = (state: ActiveShape = null, action: LevelActionTypes): ActiveShape => {
    switch (action.type) {
        //ball is no longer active once moved
        case SWAP_BALL_IDS:
        case SWAP_SLOT_BALLS:
        case UNDO:
            return null;
        //clear on new level
        case SET_LEVEL:
        case RESTART:
            return null;
        case SET_ACTIVE_BALL:
            return action.payload.id;
        default:
            return state;
    }
};

/**
 * use 1 as default instead of 0 to ensure no divide by 0 errors
 */
export const layout = (state: LevelLayout = {
    slotSize: 1,
    diameter: 1,
    boxCount: 1,
    ballsPerRow: 1,
    rowsPerBox: 1,
    boxPadding: 0,
}, action: LevelActionTypes): LevelLayout => {
    switch (action.type) {
        case SET_LAYOUT:
            return {
                ...state,
                ...action.payload.layout,
            };
        default:
            return state;
    }
};

export interface StateShape {
    balls: BallsShape,
    locHistory: HistoryShape,
    stats: StatsShape,
    slots: SlotLayoutShape,
    boxes: BoxesShape,
    active: ActiveShape,
    layout: LevelLayout,
}

export const reducer = combineReducers<StateShape>({
    locHistory,
    balls,
    stats,
    slots,
    boxes,
    active,
    layout,
});
