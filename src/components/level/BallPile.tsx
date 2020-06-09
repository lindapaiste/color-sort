import React from "react";
import {Ball} from "./Ball";
import { View } from "react-native";
import {styles} from "../../styles";
import {DraggableN} from "./Draggable";

export interface Props {
  balls: number[];
}

//TODO: diameter from context


export const BallPile = ({ balls }: Props) => {
  return (
    <View style={styles.ballPile}>
      {balls.map(id => (
        <DraggableN key={id}>
          <Ball id={id} diameter={40} />
        </DraggableN>
      ))}
    </View>
  );
};
