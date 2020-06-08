import React from "react";
import { View, StyleSheet } from "react-native";
import { Color, colorString } from "./color-util";
import { styles } from "./styles";

export interface Props {
  color: Color;
  diameter: number;
}

//TODO: is size a prop here?  probably is determined by global stylesheet
export const Ball = ({ color, diameter }: Props) => (
  <View
    style={StyleSheet.compose(
      styles.ball,
      {
        width: diameter,
        height: diameter,
        backgroundColor: colorString(color)
      }
    )}
  />
);
