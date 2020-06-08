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
export var isWin = function (state) {
    return countWrong(state) === 0;
};
export var countWrong = function (state) {
    return wrongIds(state).length;
};
export var wrongIds = function (state) {
    return wrongBalls(state).map(function (ball) { return ball.id; });
};
export var wrongBalls = function (state) {
    return allBalls(state).filter(function (ball) { return !getLocIds(state, ball.correctLocation).includes(ball.id); });
};
export var allBalls = function (state) {
    return Object.values(state.balls);
};
export var allLocIds = function (state) {
    return state.locations;
};
//-------------------------------WITH PROPS--------------------------------------------//
export var getLocBalls = function (state, location) {
    return getLocIds(state, location).map(function (id) { return getBallData(state, id); });
};
export var getLocIds = function (state, location) {
    return state.locations[location] || [];
};
export var getBallData = function (state, id) {
    return state.balls[id];
};
export var getBallColor = function (id) {
    return function (state) {
        return state.balls[id].color;
    };
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
//# sourceMappingURL=selectors.js.map