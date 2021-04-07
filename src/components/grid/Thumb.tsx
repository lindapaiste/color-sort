import {Text, TouchableOpacity, TouchableWithoutFeedbackProps, View} from "react-native";
import React from "react";
import {alphaColorString, RGB} from "../../util/color-util";
import {styles} from "../../ui/styles";
import {Icon, IconSets} from "../../ui/Icon";
import {FontAwesome5, Fontisto} from "@expo/vector-icons";

export interface Props {
    number: number,
    color: RGB,
    isPerfect: boolean,
    isWon: boolean,
    size: number,
}

/**
 * want it to maintain a square shape
 * can use padding 100% hack with CSS
 * or can declare the size
 */
    //TODO:  how to display isPerfect?
export const Thumb = ({size, number, color, isPerfect, isWon, onPress}: Props & TouchableWithoutFeedbackProps) => {
        //margin as percent leads to inconsistent amounts, so use Math.round
        const margin = Math.round(.08 * size);
        return (
            <TouchableOpacity
                onPress={onPress}
                style={[styles.centerContents, {
                    backgroundColor: alphaColorString(color, isWon ? 1 : .1), //don't want to set opacity for the whole element because it will apply to the text
                    width: size - 2 * margin,
                    height: size - 2 * margin,
                    borderRadius: size * .1,
                    //elevation: 5,
                    margin,
                }]}
            >

                <Text
                    style={{
                        opacity: 1,
                        color: "white",
                        fontSize: size * .4,
                        fontWeight: "300",
                    }}
                >
                    {number}
                </Text>
            </TouchableOpacity>
        );
    };


/*
 {isPerfect &&
                <View style={[{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                }, styles.centerContents]}>
                    <Fontisto
                        name={"star"}
                        //set={IconSets.FontAwesome5}
                        size={size * .7}
                        color={"rgba(255,255,255,.2)"}
                        //solid={true}
                    />
                </View>
                }
 */
