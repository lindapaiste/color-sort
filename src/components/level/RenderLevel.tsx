import {LOCATIONS, LocIdMap} from "../../state/level/types";
import {View} from "react-native";
import {styles} from "../../styles";
import {Scale} from "./Scale";
import {BallPile} from "./BallPile";
import React from "react";
import {Props as LevelProps} from "./Level";

export interface Props {
    isWin: boolean;
    ballMap: LocIdMap;
}

export const RenderLevel = ({isWin, ballMap, left, right}: Props & LevelProps) => {
    return (
        <View style={styles.screen}>
            {isWin && <View>YOU WIN</View>}
            <View style={styles.scalesSection}>
                <Scale balls={ballMap[LOCATIONS.LEFT]} color={left}/>
                <Scale balls={ballMap[LOCATIONS.LEFT]} color={right}/>
            </View>
            <View style={styles.unassignedSection}>
                <BallPile balls={ballMap[LOCATIONS.UNASSIGNED] || []}/>
            </View>
        </View>
    );
};
