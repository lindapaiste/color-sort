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
import { View } from "react-native";
import React from "react";
import { useLevelState, LOCATIONS } from "./level-state";
import { Scale } from "./Scale";
import { BallPile } from "./components/BallPile";
import { styles } from "./styles";
/**
 * TODO: make level state into some sort of context
 */
export var Level = function (props) {
    var mapped = useLevelState(props);
    return React.createElement(RenderLevel, __assign({}, mapped, props));
};
var RenderLevel = function (_a) {
    var isWin = _a.isWin, getLocBalls = _a.getLocBalls, left = _a.left, right = _a.right;
    return (React.createElement(View, { style: styles.screen },
        isWin && React.createElement(View, null, "YOU WIN"),
        React.createElement(View, { style: styles.scalesSection },
            React.createElement(Scale, { balls: getLocBalls(LOCATIONS.LEFT), color: left }),
            React.createElement(Scale, { balls: getLocBalls(LOCATIONS.LEFT), color: right })),
        React.createElement(View, { style: styles.unassignedSection },
            React.createElement(BallPile, { balls: getLocBalls(LOCATIONS.UNASSIGNED) }))));
};
//# sourceMappingURL=Level.js.map