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
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { allLocIds, isWin as getIsWin } from "../state/level/selectors";
import { RenderLevel } from "./RenderLevel";
import { setLevel } from "../state/level/actions";
import { generateLevelBalls } from "../util/generateLevelBalls";
export var Level = function (props) {
    var count = props.count, left = props.left, right = props.right;
    var dispatch = useDispatch();
    //want to create the level only once
    useEffect(function () {
        var balls = generateLevelBalls(props);
        dispatch(setLevel(balls));
    }, [left, right, count]);
    return (React.createElement(RenderLevel, __assign({}, props, { isWin: useSelector(getIsWin), ballMap: useSelector(allLocIds) })));
};
//# sourceMappingURL=Level.js.map