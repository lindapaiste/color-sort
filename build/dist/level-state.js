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
import { getGradient } from "./color-util";
import { useState } from "react";
import { shuffle } from "lodash";
/**
 * for first go, not using position at all
 * just what loaction it is in
 */
export var LOCATIONS;
(function (LOCATIONS) {
    LOCATIONS[LOCATIONS["LEFT"] = 0] = "LEFT";
    LOCATIONS[LOCATIONS["RIGHT"] = 1] = "RIGHT";
    LOCATIONS[LOCATIONS["UNASSIGNED"] = 2] = "UNASSIGNED";
})(LOCATIONS || (LOCATIONS = {}));
export var generateBallData = function (_a) {
    var count = _a.count, left = _a.left, right = _a.right;
    /**
     * assuming that count from props is the count of balls on EACH side,
     * so multiply times 2
     */
    var colors = getGradient(left, right, 2 * count);
    var data = colors.map(function (color, i) { return ({
        //id: i,
        color: color,
        correctLocation: i < count ? LOCATIONS.LEFT : LOCATIONS.RIGHT
    }); });
    return shuffle(data);
};
export var useLevelState = function (props) {
    var ballData = generateBallData(props);
    //TODO: useEffect to reset on level change
    var initialBallState = function () { return ({
        location: LOCATIONS.UNASSIGNED
    }); };
    var _a = __read(useState(ballData.map(initialBallState)), 2), locState = _a[0], setLocState = _a[1];
    var moveBall = function (id) { return function (location) {
        var _a;
        return setLocState(__assign(__assign({}, locState), (_a = {}, _a[id] = __assign(__assign({}, locState[id]), { location: location }), _a)));
    }; };
    var countWrong = ballData.filter(function (ball, id) { return ball.correctLocation !== locState[id].location; }).length;
    var isWin = countWrong === 0;
    var getLocIds = function (location) {
        return __spread(ballData.keys()).filter(function (id) { return locState[id].location === location; });
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