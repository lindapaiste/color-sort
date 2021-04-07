import {Icon, IconSets} from "../../ui/Icon";
import {Text, View} from "react-native";
import {Switch} from "react-native-paper";
import {styles} from "../../ui/styles";
import React from "react";

export interface Props {
    text: string,
    value: boolean,
    disabled?: boolean,

    setValue(value: boolean): void,

    iconName(value: boolean): string,

    iconSet?(value: boolean): IconSets | undefined,

    //RenderIcon(props: { value: boolean }): JSX.Element,
}

export const ToggleSetting = ({text, value, disabled = false, setValue, iconName, iconSet = () => IconSets.SimpleLineIcons}: Props) => (
    <View
        style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
        }}
    >
        <Text style={{
            color: "white",
            flex: 4,
        }}>{text}</Text>
        <Switch
            style={{
                flex: 1,
            }}
            value={value}
            disabled={disabled}
            onValueChange={setValue}
        />
        <View
            style={[styles.centerContents, {
                margin: 20,
            }]}
        >
            <Icon
                name={iconName(value)}
                set={iconSet(value)}
                size={20} //TODO: vw
            />
        </View>
    </View>
);
