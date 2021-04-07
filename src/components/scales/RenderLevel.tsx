import {BallProps, LOCATIONS, LocIdMap} from "../../state/level/types";
import {LayoutChangeEvent, Text, View} from "react-native";
import {styles} from "../../ui/styles";
import {Scale} from "./Scale";
import {BallPile} from "./BallPile";
import React from "react";
import {Props as LevelProps} from "../game/ScaleLevel";

export interface Props {
    isWin: boolean;
    ballMap: Record<LOCATIONS, BallProps[]>;
    onLayoutZone: (l: LOCATIONS) => (e: LayoutChangeEvent) => void;
}

export const RenderLevel = ({isWin, ballMap, left, right, onLayoutZone}: Props & LevelProps) => {
    return (
        <>
            <View style={styles.scalesSection}>
                <Scale count={ballMap[LOCATIONS.LEFT].length} color={left} onLayout={onLayoutZone(LOCATIONS.LEFT)}>
                    <BallPile showAll={true} balls={ballMap[LOCATIONS.LEFT] || []} location={LOCATIONS.LEFT}/>
                </Scale>
                <Scale count={ballMap[LOCATIONS.RIGHT].length} color={right} onLayout={onLayoutZone(LOCATIONS.RIGHT)}>
                    <BallPile showAll={true} balls={ballMap[LOCATIONS.RIGHT] || []} location={LOCATIONS.RIGHT}/>
                </Scale>
            </View>
            <View style={styles.unassignedSection}>
                <View onLayout={onLayoutZone(LOCATIONS.UNASSIGNED)}>
                    <BallPile showAll={false} balls={ballMap[LOCATIONS.UNASSIGNED] || []} location={LOCATIONS.UNASSIGNED}/>
                </View>
            </View>
        </>
    );
};
