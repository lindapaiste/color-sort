import React from "react";
import { StyleSheet, View } from "react-native";
import { colorString } from "../util/color-util";
import { styles } from "../styles";
//TODO: is size a prop here?  probably is determined by global stylesheet
export var ColorBall = function (_a) {
    var color = _a.color, diameter = _a.diameter;
    return (React.createElement(View, { style: StyleSheet.compose(styles.ball, {
            width: diameter,
            height: diameter,
            backgroundColor: colorString(color)
        }) }));
};
//# sourceMappingURL=ColorBall.js.map