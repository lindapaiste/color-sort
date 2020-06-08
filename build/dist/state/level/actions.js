import { MOVE_BALL, SET_LEVEL } from "./types";
export var moveBall = function (id, to, from) { return ({
    type: MOVE_BALL,
    payload: {
        id: id,
        currentLocation: from,
        newLocation: to,
    }
}); };
export var setLevel = function (balls) { return ({
    type: SET_LEVEL,
    payload: {
        balls: balls
    }
}); };
//# sourceMappingURL=actions.js.map