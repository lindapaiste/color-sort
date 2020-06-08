import React from "react";
import { Ball } from "./Ball";
import { View } from "react-native";
import { BallProps } from "./level-state";
import { styles } from "./styles";

export interface Props {
  balls: BallProps[];
}

//TODO: diameter from context
export const BallPile = ({ balls }: Props) => {
  return (
    <View style={styles.ballPile}>
      {balls.map(props => (
        <View key={props.id} style={{}}>
          <Ball {...props} diameter={40} />
        </View>
      ))}
    </View>
  );
};
