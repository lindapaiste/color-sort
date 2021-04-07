import React, {ComponentType, useState} from "react";
import {store} from "./state";
import {Provider} from "react-redux";
import {Button, Provider as PaperProvider, Text} from "react-native-paper";
import {theme} from "./ui/paper";
import {styles} from "./ui/styles";
import {TouchableHighlight, View} from "react-native";
import {Menu} from "./components/menu/MenuBar";
import {Icon} from "./ui/Icon";
import {PlayScreen} from "./components/game/PlayScreen";
import {INFINITE_BOX} from "./data/infiniteBoxProps";
import {Tester} from "./components/level-touch/ControllerTest";
import {RenderWin} from "./components/game/RenderWin";
import {random} from "lodash";
import {Portal} from "react-native-paper";
import {GeneratePreview} from "./components/boxes/PreviewLevel";
import {SampleGrid} from "./components/grid/Grid";
import {DESIGNED_LEVELS} from "./data";

const getTime = (): string => {
    const date = new Date();
    return date.toLocaleTimeString();
};

/**
 * note: redux provider needs to be outside of paper provider in order for paper Portal components to access state
 */
const App = () => {
    //const time = useMemo(getTime, []);
    return (

        <Provider store={store}>
            <PaperProvider
                theme={theme}
                settings={{
                    icon: props => <Icon {...props}/>
                }}
            >
                <View style={styles.screen}>
                    <ScreenSwitcher />
                </View>

            </PaperProvider>
        </Provider>
    );
};

interface Screen {
    Component: ComponentType<{}>;
    text: string;
}

const SCREENS: Screen[] = [
    {
        Component: () => <RenderWin
            moves={random(10, 70)}
            fewestMoves={random(10, 70)}
            time={random(10000, 100000)}
            bestTime={random(10000, 100000)}
            onPressNext={() => {
            }}
            onPressReplay={() => {
            }}
            hasNext={true}
        />,
        text: 'Win',
    },
    {
        Component: () => <>
            <PlayScreen pack={DESIGNED_LEVELS} />
            <View style={styles.menu}>
                <Menu/>
            </View>
        </>,
        text: 'Play',
    },
    {
        Component: GeneratePreview,
        text: 'Preview',
    },
    {
        Component: SampleGrid,
        text: 'Grid',
    },
    {
        Component: Tester,
        text: 'Controller Test',
    }
];

const ScreenSwitcher = () => {

    const [screen, setScreen] = useState<Screen | null>(null);

    if (screen === null) {
        return (
            <View
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-evenly",
                    alignContent: "center",
                }}
            >
                {SCREENS.map(screen => (
                    <TouchableHighlight
                        key={screen.text}
                                        onPress={() => setScreen(screen)}
                    >
                        <Text>
                            {screen.text}
                        </Text>
                    </TouchableHighlight>
                ))}
            </View>
        )
    }

    else {
        const {Component} = screen;
        return (
            <>
                <Component/>
            <Portal>
                    <Button
                        style={{backgroundColor: "gray"}}
                        onPress={() => setScreen(null)}>
                        Back
                    </Button>
            </Portal>
            </>
        );
    }
};

/*
<PlayScreen/>
<PlayScreen {...INFINITE_BOX} />
 */

/*
<BoxLevel colors={[
                            [213, 150, 214],
                            [193, 40, 90],
                            [112, 75, 219],
                            [234, 138, 92],
                        ]}
                                  ballsPerRow={5}
                                  rowsPerBox={2}
                                  levers={{
                                      noise: 100,
                                      maxDistance: .3,
                                      minDistance: 0,
                                      maxDistinctness: .5,
                                      minDistinctness: .1,
                                  }}

                        />
 */

/*
                    <View style={styles.screen}>
                        <Grid/>
                    </View>
 */

export default App;
