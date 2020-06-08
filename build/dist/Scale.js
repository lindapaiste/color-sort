import React from "react";
import { colorString } from "./color-util";
import { StyleSheet, Text, View } from "react-native";
import { BallPile } from "./components/BallPile";
import { styles } from "./styles";
export var Scale = function (_a) {
    var balls = _a.balls, color = _a.color;
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