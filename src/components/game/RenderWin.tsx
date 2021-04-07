import {MovesTime} from "../../state/user/types";
import React from "react";
import {View} from "react-native";
import {Button, Divider, Surface, Text, Title} from "react-native-paper";
import {SimpleLineIcons as Icon} from "@expo/vector-icons";

export interface FromGetStats {
    fewestMoves: number;
    bestTime?: number;
    bestMoves?: number;
}
export interface FromLevelWin {
    hasNext: boolean;
    onPressReplay(): void;

    onPressNext(): void;
}

export interface Props extends MovesTime, FromGetStats, FromLevelWin{}

/**
 * want to give badges for both accuracy and speed - but what?
 * crown, star, heart, hourglass, clock
 */

export const seconds = (ms: number): number => Math.round(ms / 1000);

//TODO: animate in
export const RenderWin = ({moves, time, fewestMoves, bestMoves, bestTime, hasNext, onPressReplay, onPressNext}: Props) => {
    const isPerfect = moves === fewestMoves;
    return (
        <View style={{justifyContent: "space-evenly",
            flex: 1,
            width: "100%",
            maxWidth: 500, //keeps buttons from getting too far apart
            paddingVertical: "10%", //note: some visual padding is already included from space-evenly
        }}>
            <Title
                style={{
                    textAlign: "center"
                }}
            >{isPerfect ? 'Perfect!' : 'You Win!'}</Title>
            <Divider
                style={{
                    marginHorizontal: "10%",
                }}
            />
            <View style={{
                alignSelf: "center",
            }}>
                <Text>Moves: {moves}</Text>
                <Text>Fewest Possible Moves: {fewestMoves}</Text>

                {!!bestMoves && bestMoves < moves &&
                <Text>Your Best: {bestMoves} </Text>
                }
                <Text><Icon name={"hourglass"}/>Time: {seconds(time)}s</Text>
                {!!bestTime && bestTime < time &&
                <Text>Your Best: {seconds(bestTime)}s</Text>
                }
            </View>
            <Divider
                style={{
                    marginHorizontal: "10%",
                }}
            />
            <View
                style={{
                    width: "100%",
                    alignSelf: "center",
                    display: "flex",
                    flexDirection: "row",
                    //padding: 20,
                    justifyContent: "space-evenly",
                }}
            >
                <Surface
                >
                    <Button
                        onPress={onPressReplay}
                        mode={"text"}
                    >
                        <Icon name={"reload"}/>
                    </Button>
                </Surface>
                {hasNext &&
                <View
                    style={{
                        //flex: 1,
                        //marginLeft: "10%",
                    }}
                >
                    <Button
                        onPress={onPressNext}
                        mode={"contained"}
                    >
                        Continue <Icon name={"arrow-right"}/>
                    </Button>
                </View>
                }
            </View>
        </View>
    )
};
