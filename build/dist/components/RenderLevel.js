import { LOCATIONS } from "../state/level/types";
import { View } from "react-native";
import { styles } from "../styles";
import { Scale } from "./Scale";
import { BallPile } from "./BallPile";
import React from "react";
export var RenderLevel = function (_a) {
    var isWin = _a.isWin, ballMap = _a.ballMap, left = _a.left, right = _a.right;
    return (React.createElement(View, { style: styles.screen },
        isWin && React.createElement(View, null, "YOU WIN"),
        React.createElement(View, { style: styles.scalesSection },
            React.createElement(Scale, { balls: ballMap[LOCATIONS.LEFT], color: left }),
            React.createElement(Scale, { balls: ballMap[LOCATIONS.LEFT], color: right })),
        React.createElement(View, { style: styles.unassignedSection },
            React.createElement(BallPile, { balls: ballMap[LOCATIONS.UNASSIGNED] || [] }))));
};
//# sourceMappingURL=RenderLevel.js.map