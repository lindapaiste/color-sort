import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import {GameEngine, GameEngineSystem} from "react-native-game-engine";
import {random, range} from "lodash";

/*
with game engine, all objects are laid on on the screen using absolute positioning
prop renderer on GameEngine gets the object containing all of the entities
 */

export const createRandom = () => {
    const [r, g, b] = [random(0, 255), random(0, 255), random(0, 255)];
    return `rgb(${r}, ${g}, ${b})`;
};

const LevelEntities = () => {
    const ids = range(0, 20);
    return Object.fromEntries(ids.map(id => [id, createRandom()]))
};

const exEntities = {
    1: { position: [40,  200], renderer: <Ball />},
    2: { position: [100, 200], renderer: <Ball />},
    3: { position: [160, 200], renderer: <Ball />},
    4: { position: [220, 200], renderer: <Ball />},
    5: { position: [280, 200], renderer: <Ball />}
};
Math.random()

export const Game = () => {
    return(
        <GameEngine
            systems = {[LogTouch]}
            entities={LevelEntities()}
            renderer={console.log}
        />
    );
};

const Ball = ({layout, position}) => {
    return (
        <View
            style={{
                position: "absolute",
                top: position[1],
                left: position[0],
                backgroundColor: "blue",
                width: 50,
                height: 50,
                borderRadius: "50%",
            }}
        />
    )
};

const LogTouch: GameEngineSystem = (entities, {touches}) => {
    touches.map(console.log);
    return entities;
};
