import React, {useEffect, useMemo} from "react";
import {RGB} from "../../util/color-util";
import {RenderLevel, ZoneData} from "../boxes/RenderLevel";
import {generateBoxBallsOld, Levers} from "../../util/generateBoxBalls";
import {useDispatch} from "react-redux";
import {setLevel} from "../../state/scale/actions";
import {useLevelSelector, useUserSelector} from "../../state";
import {getIsWin, getLocBallMap, getWrongBalls} from "../../state/scale/selectors";
import {LOCATIONS} from "../../state/scale/types";
import {useDimensions} from "../../ui/vwHooks";
import {calcSizing} from "../boxes/calcSizing";
import {getAllSettings, getSetting} from "../../state/user/selectors";
import {PlayGeneratesProps} from "./PlayScreen";

export interface _BoxLevelProps {
    colors: RGB[];
    ballsPerRow: number;
    rowsPerBox: number;
    levers: Levers;
}

/**
 * need to calculate dimensions of diameter, box rows, box columns, etc.
 */

export const _BoxLevel = (props: _BoxLevelProps & PlayGeneratesProps) => {

    const {id, colors, ballsPerRow, rowsPerBox, levers, onWin} = props;

    const noErrors = useLevelSelector(getIsWin);
    const playingLevel = useLevelSelector(state => state.stats.levelId );
    const isWin = noErrors && id === playingLevel;

    //will useEffects be evaluated in order?
    //only evaluated when isWin changes, so should be looked at
    // when the game is reset and isWin becomes false and again when it is won
    useEffect(
        () => {
            if ( isWin ) {
                onWin();
            }
        }, [isWin, id]
    );

    const dispatch = useDispatch();

    const screen = useDimensions();

    const boxCount = colors.length;

    const sizing = useMemo(
        () => calcSizing({area: {...screen, height: .9 * screen.height}, boxCount, ballsPerRow, rowsPerBox}),  //TODO: needs to account for menu size
        [screen.width, screen.height]
    );

    useEffect(
        () => {
            const ballData = generateBoxBallsOld(colors, ballsPerRow * rowsPerBox, levers);
            //console.log(ballData);

            dispatch(setLevel(ballData, id));
        },
        [colors, ballsPerRow, rowsPerBox]
    );

    const ballMap = useLevelSelector(getLocBallMap);

    const wrongBalls = useLevelSelector(getWrongBalls);
    //console.log("count incorrect: " + wrongBalls.length);
    //console.log(wrongBalls);

    const zones: ZoneData[] = colors.map((color, i) => ({
        balls: ballMap[i as LOCATIONS] || [],
        color: color,
        location: i,
    }));

    //console.log(zones);

    //console.log(useLevelSelector(s => s));

    const settings = useUserSelector(getAllSettings); //for now...

    return (
        <RenderLevel
            {...props}
            zones={zones}
            sizing={{...sizing, boxCount, ballsPerRow, rowsPerBox}}
            settings={settings}
        />
    )

};
