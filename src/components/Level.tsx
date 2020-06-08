import React, {useEffect} from "react";
import {Color} from "../util/color-util";
import {useDispatch, useSelector} from "react-redux";
import {allLocIds, isWin as getIsWin} from "../state/level/selectors";
import {RenderLevel} from "./RenderLevel";
import {setLevel} from "../state/level/actions";
import {generateLevelBalls} from "../util/generateLevelBalls";

export interface Props {
    count: number;
    left: Color;
    right: Color;
}

export const Level = (props: Props) => {
    const {count, left, right} = props;

    const dispatch = useDispatch();

    //want to create the level only once
    useEffect(
        () => {
            const balls = generateLevelBalls(props);
            dispatch(setLevel(balls));
        },
        [left, right, count]
    );

    return (
        <RenderLevel
            {...props}
            isWin={useSelector(getIsWin)}
            ballMap={useSelector(allLocIds)}
        />
    );
};

