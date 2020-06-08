import React from "react";
import {IdBall} from "./IdBall";
import { View } from "react-native";
import {styles} from "../styles";


export interface Props {
  balls: number[];
}

//TODO: diameter from context


export const BallPile = ({ balls }: Props) => {
  return (
    <View style={styles.ballPile}>
      {balls.map(id => (
        <View key={id} style={{}}>
          <IdBall id={id} diameter={40} />
        </View>
      ))}
    </View>
  );
};
