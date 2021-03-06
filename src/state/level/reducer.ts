import {combineReducers} from "redux";
import {BallData, LevelActionTypes, LocIdMap, RESET, SET_LEVEL, MOVE_BALL} from "./types";
import {groupBy, keyBy, mapValues, without} from "lodash";

export const locations = (state: LocIdMap = {}, action: LevelActionTypes): LocIdMap => {
    switch (action.type) {
        case RESET:
            //TODO
            return state;
        case SET_LEVEL:
            const {balls} = action.payload;
            const grouped = groupBy(balls, b => b.initialLocation);
            return mapValues(grouped, balls => balls.map(b => b.id));
        case MOVE_BALL:
            const {id, currentLocation, newLocation} = action.payload;
            if (currentLocation === newLocation) {
                return state;
            }
            return {
                ...state,
                [currentLocation]: without(state[currentLocation], id),
                [newLocation]: [id, ...state[newLocation]], //prepends to the beginning
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
}

export const stats = (state: StatsShape = {startTime: 0, moves: 0}, action: LevelActionTypes): StatsShape => {
  switch (action.type) {
      case MOVE_BALL:
          return {
              ...state,
              moves: state.moves + 1,
          };
      case SET_LEVEL:
          return {
              ...state,
              startTime: action.meta.timestamp,
          };
      default:
          return state;
  }
};

export interface StateShape {
    balls: BallsShape,
    locations: LocIdMap,
    stats: StatsShape,
}

export const reducer = combineReducers({
    locations,
    balls,
    stats,
});
