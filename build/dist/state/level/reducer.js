var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spread = (this && this.__spread) || function () {
    for (var ar = [], i = 0; i < arguments.length; i++) ar = ar.concat(__read(arguments[i]));
    return ar;
};
import { combineReducers } from "redux";
import { groupBy, keyBy, mapValues, without } from "lodash";
export var locations = function (state, action) {
    var _a;
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case "RESET_LEVEL":
            //TODO
            return state;
        case "SET_LEVEL":
            var balls_1 = action.payload.balls;
            var grouped = groupBy(balls_1, function (b) { return b.initialLocation; });
            return mapValues(grouped, function (balls) { return balls.map(function (b) { return b.id; }); });
        case "MOVE_BALL":
            var _b = action.payload, id = _b.id, currentLocation = _b.currentLocation, newLocation = _b.newLocation;
            if (currentLocation === newLocation) {
                return state;
            }
            return __assign(__assign({}, state), (_a = {}, _a[currentLocation] = without(state[currentLocation], id), _a[newLocation] = __spread([id], state[newLocation]), _a));
        default:
            return state;
    }
};
export var balls = function (state, action) {
    if (state === void 0) { state = {}; }
    switch (action.type) {
        case "SET_LEVEL":
            var balls_2 = action.payload.balls;
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
            return keyBy(balls_2, function (b) { return b.id; }); //TODO: check key is number not string
        default:
            return state;
    }
};
export var reducer = combineReducers({
    locations: locations,
    balls: balls,
});
//# sourceMappingURL=reducer.js.map