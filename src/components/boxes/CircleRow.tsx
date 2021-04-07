import React, {PropsWithChildren} from "react";
import {View} from "react-native";

export const CircleRow = ({children}: PropsWithChildren<{}>) => {
    return (
        <View
            style={{
                display: "flex",
                flexDirection: "row",
            }}
        >
            {children}
        </View>
    )
};
