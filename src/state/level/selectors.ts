import {BallData, LOCATIONS, LocIdMap} from "./types";
import {StateShape as State} from "./reducer";
import {Color} from "../../util/color-util";

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

export const isWin = (state: State): boolean => {
    return countWrong(state) === 0;
};

export const countWrong = (state: State): number => {
    return wrongIds(state).length;
};

export const wrongIds = (state: State): number[] => {
    return wrongBalls(state).map(ball => ball.id);
};

export const wrongBalls = (state: State): BallData[] => {
    return allBalls(state).filter(
        ball => !getLocIds(state, ball.correctLocation).includes(ball.id)
    );
};

export const allBalls = (state: State): BallData[] => {
    return Object.values(state.balls);
};

export const allLocIds = (state: State): LocIdMap => {
    return state.locations;
};

export const getMoveCount = (state: State): number => {
    return state.stats.moves;
};

export const getElapsedTime = (state: State): number => {
  return Date.now() - state.stats.startTime;
};

//-------------------------------WITH PROPS--------------------------------------------//

export const getLocBalls = (state: State, location: LOCATIONS): BallData[] => {
    return getLocIds(state, location).map(
        id => getBallData(state, id)
    );
};

export const getLocIds = (state: State, location: LOCATIONS): number[] => {
    return state.locations[location] || [];
};

export const getBallData = (state: State, id: number): BallData => {
    return state.balls[id];
};

export const getBallColor = (id: number) =>
    (state: State): Color => {
        return state.balls[id].color;
    };

/*
const flatBallData = (state: State): LocatedBall[] => {
    return allBalls(state).map( ball => ({
        ...ball,
        currentLocation: getBallLocation( state, ball.id ),
    }))
};

export const getBallLocation = (state: State, id: number): LOCATIONS => {
    Object.keys( state.locations ).forEach(
        location => {
            if ( getLocIds(state, location) )
        })
};*/
