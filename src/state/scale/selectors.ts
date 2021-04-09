import {
    BallData,
    BallProps,
    createLocationMap,
    DropZoneMap,
    I_Slot,
    LocatedBall,
    LOCATIONS,
    LocIdMap,
    ZoneId
} from "./types";
import {StateShape as State} from "./reducer";
import {RGB} from "../../util/color-util";
import {findKey, last, mapValues} from "lodash";
import {LayoutRectangle} from "react-native";

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

//----------------------------------COMPAT-----------------------------------------//
export const getBoxSlots = () => {};
export const getSlotBall = () => {};


//----------------------------------WITHOUT PROPS-----------------------------------------//

export const getIsWin = (state: State): boolean => {
    return getCountWrong(state) === 0 && state.stats.moves > 0;
};

export const getCountWrong = (state: State): number => {
    return getWrongIds(state).length;
};

export const getWrongIds = (state: State): number[] => {
    return getWrongBalls(state).map(ball => ball.id);
};

export const getWrongBalls = (state: State): BallData[] => {
    return getAllBalls(state).filter(
        ball => !getLocIds(ball.correctLocation)(state).includes(ball.id)
    );
};

export const getAllBalls = (state: State): BallData[] => {
    return Object.values(state.balls);
};

export const getLocIdMap = (state: State): Partial<LocIdMap> => {
    return last(state.locHistory) || {};
};

export const getLocBallMap = (state: State): Partial<Record<LOCATIONS, Array<BallData & LocatedBall>>> => {
    return mapValues(getLocIdMap(state), (ids = [], location) => {
        return ids.map((id, position) => ({
            ...state.balls[id],
            currentLocation: parseInt(location),
            position,
        }))
    });
};

export const _scaleFilled_allLocBalls = (state: State): Record<LOCATIONS, BallProps[]> => {
    const diameter = 40;
    return createLocationMap(location => {
        const ids = getLocIdMap(state)[location] || [];
        return ids.map(id => ({
            ...state.balls[id],
            diameter,
            currentLocation: location,
        }))
    });
};

export const getMoveCount = (state: State): number => {
    return state.stats.moves;
};

export const getElapsedTime = (state: State): number => {
    return Date.now() - state.stats.startTime;
};

export const getDropZones = (state: State): Partial<DropZoneMap> => {
    return state.zones;
};

export const getActiveBall = (state: State): number | null => {
    return state.active;
};

//-------------------------------WITH PROPS--------------------------------------------//

export const getZoneRectangle = (zoneId: ZoneId) =>
    (state: State): LayoutRectangle | undefined => {
    return state.zones[zoneId];
    };

export const getLocBalls = (location: LOCATIONS) =>
    (state: State): BallData[] => {
        return getLocIds(location)(state).map(
            id => getBallData(id)(state)
        );
    };

export const getLocIds = (location: LOCATIONS) =>
    (state: State): number[] => {
        return getLocIdMap(state)[location] || [];
    };

export const getSlotBallId = ({location, position}: I_Slot) =>
    (state: State): number | undefined => {
        return getLocIds(location)(state)[position];
    };

export const getBallData = (id: number) =>
    (state: State): BallData => {
        return state.balls[id];
    };

export const getBallColor = (id: number) =>
    (state: State): RGB => {
        return state.balls[id].color;
    };

export const getBallLocation = (id: number | null) =>
    (state: State): LOCATIONS | null => {
        if (id === null) return null;
        const key = findKey(getLocIdMap(state), ids => !!ids && ids.includes(id)); //shouldn't ever be undefined, but with the way state is set up it could be
        return key === undefined ? null : parseInt(key);
    };

export const getBallSlot = (id: number | null) =>
    (state: State): I_Slot | null => {
        const location = getBallLocation(id)(state);
        if (location !== null && id !== null) {
            return {
                location,
                position: (getLocIds(location)(state)).indexOf(id),
            }
        } else return null;
        /*
            if (id === null) return null;
            //could write this more concisely, but want to break loop when match found
            for ( let locString in Object.keys(state.locations) ) {
                const location = parseInt(locString) as LOCATIONS;
                const ids = state.locations[location] || [];
                const position = ids.indexOf(id);
                if ( position !== -1 ) {
                    return {
                        location,
                        position
                    }
                }
            }
            //should never get here, but just in case
            return null;*/
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
