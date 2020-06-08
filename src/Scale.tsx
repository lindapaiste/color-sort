import React from "react";
import { Ball } from "./Ball";
import { Color, colorString } from "./color-util";
import { View, Text, StyleSheet } from "react-native";
import { BallProps } from "./level-state";
import { BallPile } from "./BallPile";
import { styles } from "./styles";

export interface Props {
  balls: BallProps[];
  color: Color;
}

export const Scale = ({ balls, color }: Props) => {
  return (
    <View style={styles.scaleSide}>
      <BallPile balls={balls} />
      <View
        style={StyleSheet.compose(
          styles.scaleBase,
          {
            backgroundColor: colorString(color)
          }
        )}
      >
        <Text>{balls.length} Balls</Text>
      </View>
    </View>
  );
};
