import {combineReducers} from "redux";
import {
    BallData,
    DropZoneMap,
    LevelActionTypes,
    LocIdMap,
    MOVE_BALL,
    RESTART,
    SET_ACTIVE_BALL,
    SET_LAYOUT,
    SET_LEVEL,
    SWAP_BALLS,
    UNDO
} from "./types";
import {groupBy, keyBy, last, mapValues} from "lodash";
import {insertIndex, removeValue} from "../../util/array-edit";


export type HistoryShape = Partial<LocIdMap>[];

export const locHistory = (state: HistoryShape = [], action: LevelActionTypes): HistoryShape => {
    switch (action.type) {
        case RESTART:
            return state.slice(0, 1);
        case UNDO:
            return state.slice(0, -1);
        case SET_LEVEL:
            const {balls} = action.payload;
            const grouped = groupBy(balls, b => b.initialLocation);
            const map = mapValues(grouped, balls => balls.map(b => b.id));
            return [map];
        case SWAP_BALLS:
        case MOVE_BALL:
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

export const nextLocations = (state: Partial<LocIdMap> = {}, action: LevelActionTypes): Partial<LocIdMap> => {
    switch (action.type) {
        case MOVE_BALL:
            const {id, location, position} = action.payload;
            //doing in two separate steps in case changing position but not location
            const removed = mapValues(state, ids => removeValue((ids || []), id));
            return {
                ...removed,
                [location]: insertIndex((state[location] || []), position, id),
            };
        case SWAP_BALLS:
            const [a, b] = action.payload.ids;
            //involves object creation which is not necessary, but idk if it's a problem
            return mapValues(state, (ids = []) =>
                ids.map(id => id === a ? b : id === b ? a : id)
            );
        default:
            return state;
    }
};

//export const zones = (state: DropZoneMap = EMPTY_ZONE_MAP, action: LevelActionTypes): DropZoneMap => {
export const zones = (state: Partial<DropZoneMap> = {}, action: LevelActionTypes): Partial<DropZoneMap> => {
    switch (action.type) {
        case SET_LAYOUT:
            const {zoneId, layout} = action.payload;
            return {
                ...state,
                [zoneId]: layout,
            };
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
        case MOVE_BALL:
        //want to only count it as a move if the location has changed, ignoring changes to position
        //but this info is not currently included in the action
        case SWAP_BALLS:
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
        case MOVE_BALL:
        case SWAP_BALLS:
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

export interface StateShape {
    balls: BallsShape,
    locHistory: HistoryShape,
    stats: StatsShape,
    zones: Partial<DropZoneMap>,
    active: ActiveShape,
}

export const reducer = combineReducers<StateShape>({
    locHistory,
    balls,
    stats,
    zones,
    active,
});
