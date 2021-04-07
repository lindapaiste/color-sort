import React, {useState} from "react";
import {SimpleLineIcons as Icon} from "@expo/vector-icons";
//import {IconProps} from "react-native-vector-icons/Icon";
import {styles} from "../../ui/styles";
import {View} from "react-native";
import {Portal} from "react-native-paper";
import {SettingsModal} from "./Settings";
import {useVw} from "../../ui/vwHooks";
import {HintsModal} from "./Hints";
import {Replay} from "./Replay";
import {clamp} from "lodash";

enum EXPANDABLE {
    SETTINGS,
    HINTS,
    RESTART,
    UNDO,
    GRID,
}

export const Menu = () => {

    const [expanded, setExpanded] = useState<EXPANDABLE | null>(null);

    const close = () => setExpanded(null);

    const isOpen = expanded !== null;

    const props = {isOpen, close, menu: expanded};

    return (
        <>
            <MenuBar setExpanded={setExpanded}/>
            <Portal>
                {expanded === EXPANDABLE.HINTS ?
                    <HintsModal {...props}/>
                    :
                    expanded === EXPANDABLE.SETTINGS ?
                        <SettingsModal {...props}/>
                        :
                        expanded === EXPANDABLE.RESTART ?
                            <Replay {...props}/>
                            :
                            <></>
                }
            </Portal>
        </>
    );
};

//TODO: conditionally hide/deactivate icons on win screen etc, but maintain position

export const MenuBar = ({setExpanded}: { setExpanded: (s: EXPANDABLE) => void }) => (
    <View style={styles.menu}>
        <MenuIcon name={"refresh"} onPress={() => setExpanded(EXPANDABLE.RESTART)}/>
        <MenuIcon name={"action-undo"} onPress={() => setExpanded(EXPANDABLE.UNDO)}/>
        <MenuIcon name={"bulb"} onPress={() => setExpanded(EXPANDABLE.HINTS)}/>
        <MenuIcon name={"settings"} onPress={() => setExpanded(EXPANDABLE.SETTINGS)}/>
    </View>
);

/**
 * initially wanted to allow passing through of any allowed IconProps, but the typescript creates a fatal error on native
 * because IconProps is only exported in "react-native-vector-icons" but not in the expo version "@expo/vector-icons"
 */
export const MenuIcon = ({onPress, name}: { name: string, onPress: () => void }) => {
    return (
        <Icon
            name={name}
            color={"white"}
            onPress={onPress}
            //use 3% as the baseline with a minimum of 15 and maximum of 30
            size={clamp(useVw(3), 15, 30)}
            style={{
                padding: 10,
            }}
        />
    )
};
