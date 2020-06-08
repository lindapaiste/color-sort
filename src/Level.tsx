import { Ball } from "./Ball";
import { View } from "react-native";
import React from "react";
import { useLevelState, LevelStateReturns, LOCATIONS } from "./level-state";
import { Color } from "./color-util";
import { Scale } from "./Scale";
import { BallPile } from "./BallPile";
import { styles } from "./styles";

export interface Props {
  count: number;
  left: Color;
  right: Color;
}

/**
 * TODO: make level state into some sort of context
 */
export const Level = (props: Props) => {
  const mapped = useLevelState(props);
  return <RenderLevel {...mapped} {...props} />;
};

const RenderLevel = ({
  isWin,
  getLocBalls,
  left,
  right
}: LevelStateReturns & Props) => {
  return (
    <View style={styles.screen}>
      {isWin && <View>YOU WIN</View>}
      <View style={styles.scalesSection}>
        <Scale balls={getLocBalls(LOCATIONS.LEFT)} color={left} />
        <Scale balls={getLocBalls(LOCATIONS.LEFT)} color={right} />
      </View>
      <View style={styles.unassignedSection}>
        <BallPile balls={getLocBalls(LOCATIONS.UNASSIGNED)} />
      </View>
    </View>
  );
};
