import React from "react";
import {Color, colorString} from "../../util/color-util";
import {Text, View} from "react-native";
import {BallPile} from "./BallPile";
import {styles} from "../../styles";

export interface Props {
    balls?: number[];
    color: Color;
}

export const Scale = ({balls = [], color}: Props) => {
    return (
        <View style={styles.scaleSide}>
            <BallPile balls={balls}/>
            <View
                style={[styles.scaleBase, {
                    backgroundColor: colorString(color)
                }]}
            >
                <Text style={{
                    width: "100%",
                    textAlign: "center",
                }}>{balls.length} Balls</Text>
            </View>
        </View>
    );
};
