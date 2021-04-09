import React, {PropsWithChildren, useEffect, useRef} from "react";
import {Animated, Text, TouchableHighlight, View} from "react-native";
import {BallProps, LOCATIONS} from "../../state/scale/types";
import {colorString, RGB} from "../../util/color-util";
import {BoxSizes, LayoutSettings} from "./calcSizing";
import {chunk, random} from "lodash";
import {MoveableBall} from "../animated/AnimatedBall";
import {LayoutContext} from "./LayoutContext";
import {SettingsShape} from "../../state/user/types";
import {STATES} from "../animated/useLevelAnimation";
import {useDimensions} from "../../ui/vwHooks";
import {PlayGeneratesProps} from "../game/PlayScreen";
import {styles} from "../../ui/styles";
import {BoxSwapLevelHandler} from "../animated/LevelDrag";
import {CircleRow} from "./CircleRow";

/**
 * note: location equals index of color
 * (determined by generateBoxBalls)
 */

/**
 * should a move be a swap, or just a move? what is the max quantity of each box?
 */

export interface ZoneData {
    balls: BallProps[];
    color: RGB;
    location: LOCATIONS;
    //sizing info?
}

export interface PropSizing {
    sizing: BoxSizes & LayoutSettings;
}

export interface PropSettings {
    settings: Partial<SettingsShape>;
}


export interface PropEffects {
    winEffectTiming: Animated.Value;
    loadInTiming: Animated.Value;
}

export interface Props {
    zones: ZoneData[];
    sizing: BoxSizes & LayoutSettings;
    settings?: Partial<SettingsShape>;
}

/**
 * win effect:
 * from 0 to .5, do fade to solid block
 * from .5 to 1, do slide over to black
 */

export const RenderLevel = ({state, id, zones, sizing, settings = {}, loadInTiming, winEffectTiming}: Props & PlayGeneratesProps) => {

    //const {fadeOut, slideOver, baseDiameter, startWinEffect, startLoadIn, resetWinEffect} = useLevelAnimation(sizing);

    const fadeOut = useRef(new Animated.Value(0)).current;
    const slideOver = useRef(new Animated.Value(0)).current;
    const baseDiameter = useRef(new Animated.Value(0)).current;

    const startLoadIn = () => {
      Animated.timing(baseDiameter, {
          toValue: sizing.diameter,
          duration: 1000,
          useNativeDriver: true,
      }).start();
    };


    const startWinEffect = () => {
        Animated.sequence([
            Animated.parallel([
                Animated.timing(fadeOut, {
                    toValue: 1,
                    duration: 3000,
                    useNativeDriver: true,
                }),
                Animated.timing(baseDiameter, {
                    toValue: sizing.slotSize,
                    duration: 3000,
                    useNativeDriver: true,
                })
            ]),
            Animated.timing(slideOver, {
                toValue: 1,
                duration: 3000,
                useNativeDriver: true,
            }),
        ]).start();
    };

    const resetWinEffect = () => {
        fadeOut.setValue(0);
        slideOver.setValue(0);
    };

    useEffect(() => {
        startLoadIn();
    }, [id]); //use numeric id to know when it's a new level

    useEffect(() => {
        if (state === STATES.WIN_TRANSITION) {
            startWinEffect();
        } else {
            resetWinEffect();
        }
    }, [state]);


    /**
     * can avoid prop drilling by defining components as containers independent of their contents and doing all of the looping at the highest level
     */
    return (
        <LayoutContext.Provider value={sizing}>
            <TouchableHighlight onPress={() => console.log(sizing)}><Text>Log Sizing</Text></TouchableHighlight>
            <BoxSwapLevelHandler>
        <View
            style={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
                //marginVertical: sizing.boxMargin, //so as to double up on top and bottom to match middles
            }}
        >
            {zones.map((zone, boxIndex) => (
                    <Box {...zone} {...sizing} winEffectTiming={winEffectTiming} index={boxIndex}>
                        {chunk(zone.balls, sizing.ballsPerRow).map((row, rowIndex) => (
                            <CircleRow key={rowIndex}>
                                {row.map((ball, columnIndex) => (
                                    <MoveableBall
                                        key={ball.id}
                                        id={ball.id}
                                        position={columnIndex + sizing.ballsPerRow * rowIndex}
                                        color={winEffectTiming.interpolate({
                                            inputRange: [0, .5, 1],
                                            outputRange: [colorString(ball.color), colorString(zone.color), colorString(zone.color)],
                                        })}
                                        diameter={sizing.diameter}
                                        scale={state === STATES.LOADING_IN ? loadInTiming.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [0, 1],
                                        }) : winEffectTiming.interpolate({
                                            inputRange: [0, .5, 1],
                                            outputRange: [1, sizing.slotSize/sizing.diameter, sizing.slotSize/sizing.diameter],
                                        })}
                                        borderRadius={winEffectTiming.interpolate({
                                            inputRange: [0, .5, 1],
                                            outputRange: [.5, 0, 0],
                                        })}
                                        slotSize={sizing.slotSize}
                                        currentLocation={zone.location}
                                        isCheck={settings.isShowCheck && ball.correctLocation === ball.currentLocation && state === STATES.PLAYING}
                                    />
                                ))}
                            </CircleRow>
                        ))}
                    </Box>
            ))}
        </View>
            </BoxSwapLevelHandler>
        </LayoutContext.Provider>
    )
};

export const Box = ({color: RGB, location, children, boxPadding, winEffectTiming, index}: PropsWithChildren<ZoneData> & BoxSizes & { winEffectTiming: Animated.Value, index: number }) => {

    const timingOffset = random(-.1, .1, true);
    const screenWidth = useDimensions().width;

    const isOdd = index % 2;
    const color = colorString(RGB);
    /**
     * on fadeOut, can have either:
     * boxPadding goes to to 0 and is replaced by an increase in borderWidth
     * backgroundColor fades in from black/none/inherit to color
     * can make use of opacity on color but this is tricky because opacity applies to contents as well
     */
    return (
        <Animated.View
            //don't set margin here, that's where the tweaking can happen by the DOM
            style={[styles.centerContents, {
                //margin: boxMargin,
                padding: boxPadding,
                borderColor: color,
                borderWidth: 1, //boxBorder,
                borderLeftWidth: 10,
                elevation: 5,
                backgroundColor: winEffectTiming.interpolate({
                    inputRange: [0, .5 + timingOffset, 1],
                    outputRange: ["rgb(0,0,0)", color, color]
                }),
                transform: [{
                    translateX: winEffectTiming.interpolate({
                        inputRange: [0, .5 + timingOffset, 1],
                        outputRange: [0, 0, (isOdd ? -1 : 1) * screenWidth]
                    })
                }],
            }]}
        >
            <View
                //onLayout={e => dispatch(setZoneLayout(location, e.nativeEvent.layout))}  //TODO: this should somehow include the margin
            >
                {children}
            </View>
        </Animated.View>
    )
};

