import React from "react";
import {Color, colorString} from "../util/color-util";
import {StyleSheet, Text, View} from "react-native";
import {BallPile} from "./BallPile";
import {styles} from "../styles";

export interface Props {
    balls?: number[];
    color: Color;
}

export const Scale = ({balls = [], color}: Props) => {
    return (
        <View style={styles.scaleSide}>
            <BallPile balls={balls}/>
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
