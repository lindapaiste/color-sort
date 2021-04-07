import React, {useEffect, useRef, useState} from "react";
import {styles} from "../../ui/styles";
import {Animated, TouchableHighlight, View} from "react-native";
import {useReplay} from "./useReplay";
import {STATES} from "../animated/useLevelAnimation";
import {Text} from "react-native-paper";
import {LevelWin} from "./LevelWin";
import {I_PackPlay} from "../../data/types";


/**
 * use of useReplay hook here ties this to the box swap state -- find another way
 */

export interface PlayGeneratesProps {
    id: number;
    onWin: () => void;
    loadInTiming: Animated.Value;
    winEffectTiming: Animated.Value;
    state: STATES;
}

/**
 * if the pack is a class rather than a plain object, cannot spread class methods into props.
 * so pass pack as a single prop and DO NOT SPREAD
 */

export const PlayScreen = <Props extends {}>({pack, startLevel = 1}: { startLevel?: number, pack: I_PackPlay<Props> }) => {

    const [levelId, setLevelId] = useState<number>(startLevel);

    const [state, setState] = useState<STATES>(STATES.LOADING_IN);

    const loadInTiming = useRef(new Animated.Value(0)).current;
    const winEffectTiming = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        console.log("state: " + state);
        if (state === STATES.LOADING_IN) {
            Animated.timing(loadInTiming, {
                toValue: 1,
                duration: 2000,
                //useNativeDriver: true,
            }).start(
                () => {
                    setState(STATES.PLAYING);
                }
            );
        } else if (state === STATES.WIN_TRANSITION) {

            Animated.timing(winEffectTiming, {
                toValue: 1,
                duration: 3000,
                //useNativeDriver: true,
            }).start(
                () => {
                    setState(STATES.WIN_SCREEN);
                }
            );
        } else if (state === STATES.PLAYING) {
            loadInTiming.setValue(0);
        } else if (state === STATES.WIN_SCREEN) {
            winEffectTiming.setValue(0);
        }
        //todo: return cleanup to stop animation
    }, [state]);

    const onPressNext = () => {
        setLevelId(levelId + 1);
        setState(STATES.LOADING_IN);
        //this is where I would use nextLevelProps
    };

    const onWin = () => {
        setState(STATES.WIN_TRANSITION);
    };

    const replay = useReplay();

    const onPressReplay = () => {
        //need to replay with same balls, but reset to original state
        replay();
        setState(STATES.LOADING_IN);
    };

    /**
     * cannot use selector isWin here because will return true before the scales has been loaded
     */

    /**
     * want to preload next level props for smoother load in
     */

    const loadLevelProps = (id: number): Props & { id: number } => {
        const props = pack.getLevelProps(levelId);
        return {
            ...props,
            id,
        }
    };

    const [levelProps, setLevelProps] = useState<Props & { id: number }>(loadLevelProps(startLevel));

    const [nextProps, setNextProps] = useState<Props & { id: number } | undefined | null>(undefined);

    useEffect(() => {
        if (state === STATES.WIN_SCREEN) {
            if (!pack.hasNextLevel(levelId)) {
                setNextProps(null);
            } else {
                const next = loadLevelProps(levelId + 1);
                setNextProps(next);
            }
        } else if (state === STATES.LOADING_IN) {
            if (!!nextProps && nextProps.id === levelId) {
                setLevelProps(nextProps);
            } else if (levelId ! == levelProps.id) {
                setLevelProps(loadLevelProps(levelId));
            }
        }
    }, [state]);

    //const levelProps: Props & { id: number } = useMemo( () => loadLevelProps(levelId), [levelId]);


    return (
        <View style={styles.playArea}>
            {(state === STATES.WIN_SCREEN || state === STATES.WIN_TRANSITION) &&
            <Animated.View
                style={[styles.centerContents, styles.playFill, {
                    opacity: winEffectTiming.interpolate({
                        inputRange: [0, .7, 1],
                        outputRange: state === STATES.WIN_SCREEN ? [1, 1, 1] : [0, 0, 1]
                    })
                }]}>
                <LevelWin
                    id={levelId}
                    onPressReplay={onPressReplay}
                    onPressNext={onPressNext}
                    getStats={() => pack.getStats(levelProps)}
                    hasNext={pack.hasNextLevel(levelId)}
                />
            </Animated.View>
            }
            {state !== STATES.WIN_SCREEN &&
            <>
                <View
                    style={[styles.centerContents, styles.playFill]}>
                    <TouchableHighlight onPress={onWin}><Text>Run Win Effect</Text></TouchableHighlight>
                    <pack.Render
                        {...levelProps}
                        id={levelId}
                        onWin={onWin}
                        loadInTiming={loadInTiming}
                        winEffectTiming={winEffectTiming}
                        state={state}
                    />
                </View>
            </>
            }
        </View>
    )

};


