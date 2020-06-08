import React from "react";
import { IdBall } from "./IdBall";
import { View } from "react-native";
import { styles } from "../styles";
//TODO: diameter from context
export var BallPile = function (_a) {
    var balls = _a.balls;
    return (React.createElement(View, { style: styles.ballPile }, balls.map(function (id) { return (React.createElement(View, { key: id, style: {} },
        React.createElement(IdBall, { id: id, diameter: 40 }))); })));
};
//# sourceMappingURL=BallPile.js.map