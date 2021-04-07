import React, {FunctionComponent} from "react";
import {RGB, colorString} from "../../util/color-util";
import {Text, View, ViewProps} from "react-native";
import {styles} from "../../ui/styles";

export interface Props {
    count: number;
    color: RGB;
}

export const Scale: FunctionComponent<Props & Pick<ViewProps, 'onLayout'>> = ({count, color, onLayout, children}) => {
    return (
        <View style={styles.scaleSide} onLayout={onLayout}>
            {children}
            <View
                style={[styles.scaleBase, {
                    backgroundColor: "white",//colorString(color)
                }]}
            >
                <Text style={{
                    width: "100%",
                    textAlign: "center",
                }}>{count} Balls</Text>
            </View>
        </View>
    );
};
