import React from "react";
import {StyleSheet, View} from "react-native";
import {RGB, colorString} from "../../util/color-util";
import {styles} from "../../ui/styles";

export interface Props {
  color: RGB;
  diameter: number;
}

//TODO: is size a prop here?  probably is determined by global stylesheet
export const RenderBall = ({ color, diameter }: Props) => (
  <View
    style={{
        borderRadius: diameter * .5,
        width: diameter,
        height: diameter,
        backgroundColor: colorString(color)
      }}
  />
);

