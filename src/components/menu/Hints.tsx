import {__useLevelSelector} from "../../state";
import {getCountWrong} from "../../state/scale/selectors";
import {TouchableHighlight, View} from "react-native";
import React from "react";
import {Text} from "react-native-paper";
import {makeModal} from "./Modal";

export const Hints = ({close}: { close: () => void }) => {
    const incorrect = __useLevelSelector(getCountWrong);

    return (
        <View>
            <Text>Count Incorrect: {incorrect}</Text>

            <TouchableHighlight onPress={close}>
                <Text>Show Correct</Text>
            </TouchableHighlight>
        </View>
    )
};

export const HintsModal = makeModal(Hints);
