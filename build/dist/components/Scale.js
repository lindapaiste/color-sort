import React from "react";
import { colorString } from "../util/color-util";
import { StyleSheet, Text, View } from "react-native";
import { BallPile } from "./BallPile";
import { styles } from "../styles";
export var Scale = function (_a) {
    var _b = _a.balls, balls = _b === void 0 ? [] : _b, color = _a.color;
    return (React.createElement(View, { style: styles.scaleSide },
        React.createElement(BallPile, { balls: balls }),
        React.createElement(View, { style: StyleSheet.compose(styles.scaleBase, {
                backgroundColor: colorString(color)
            }) },
            React.createElement(Text, null,
                balls.length,
                " Balls"))));
};
//# sourceMappingURL=Scale.js.map