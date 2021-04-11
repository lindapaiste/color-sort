import React, {useEffect} from "react";
import {RGB} from "../../util/color-util";
import {useDispatch} from "react-redux";
import {_scaleFilled_allLocBalls, getIsWin as getIsWin, getWrongBalls} from "../../state/scale/selectors";
import {RenderLevel} from "../scales/RenderLevel";
import {setLevel, setZoneLayout} from "../../state/scale/actions";
import {generateScaleBalls} from "../../util/generateScaleBalls";
import {LOCATIONS} from "../../state/scale/types";
import {LayoutChangeEvent} from "react-native";
import {__useLevelSelector} from "../../state";

export interface Props {
    count: number;
    left: RGB;
    right: RGB;
}

export const ScaleLevel = (props: Props & {onWin?: (p: Props) => void}) => {
    const {count, left, right, onWin = () => {}} = props;

    const dispatch = useDispatch();

    //want to create the scales only once
    useEffect(
        () => {
            const balls = generateScaleBalls(props);
            dispatch(setLevel(balls));
        },
        [left, right, count]
    );

    const onLayoutZone = (location: LOCATIONS) => (e: LayoutChangeEvent) => {
        //temp hacky fix to get any value above the scale
        const zone = (location === LOCATIONS.UNASSIGNED) ? e.nativeEvent.layout : {
                ...e.nativeEvent.layout,
                y: 0,
                height: e.nativeEvent.layout.height + e.nativeEvent.layout.y,
            };

        console.log({
            location,
            e,
            action: setZoneLayout(location, zone)
        });

        dispatch(setZoneLayout(location, zone));
    };

    const isWin = __useLevelSelector(getIsWin);


    //will useEffects be evaluated in order?
    //only evaluated when isWin changes, so should be looked at
    // when the game is reset and isWin becomes false and again when it is won
    useEffect(
        () => {
            if ( isWin ) {
                onWin(props);
            }
        }, [isWin]
    );

    const wrong = __useLevelSelector(getWrongBalls);
    //console.log({wrong});

    return (
        <RenderLevel
            {...props}
            isWin={__useLevelSelector(getIsWin)}
            ballMap={__useLevelSelector(_scaleFilled_allLocBalls)}
            onLayoutZone={onLayoutZone}
        />
    );
};

