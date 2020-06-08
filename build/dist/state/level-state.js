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
import { useState } from "react";
import { LOCATIONS } from "./level/types";
import { generateLevelBalls } from "../util/generateLevelBalls";
export var useLevelState = function (props) {
    var ballData = generateLevelBalls(props);
    //TODO: useEffect to reset on level change
    var initialBallState = function () { return ({
        currentLocation: LOCATIONS.UNASSIGNED
    }); };
    var _a = __read(useState(ballData.map(initialBallState)), 2), locState = _a[0], setLocState = _a[1];
    var moveBall = function (id) { return function (location) {
        var _a;
        return setLocState(__assign(__assign({}, locState), (_a = {}, _a[id] = __assign(__assign({}, locState[id]), { currentLocation: location }), _a)));
    }; };
    var countWrong = ballData.filter(function (ball, id) { return ball.correctLocation !== locState[id].currentLocation; }).length;
    var isWin = countWrong === 0;
    var getLocIds = function (location) {
        return __spread(ballData.keys()).filter(function (id) { return locState[id].currentLocation === location; });
    };
    var getBallProps = function (id) { return ({
        id: id,
        color: ballData[id].color,
        move: moveBall(id)
    }); };
    var getLocBalls = function (location) {
        return getLocIds(location).map(getBallProps);
    };
    return {
        isWin: isWin,
        countWrong: countWrong,
        getLocBalls: getLocBalls
    };
};
//# sourceMappingURL=level-state.js.map