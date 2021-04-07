import {View} from "react-native";
import React from "react";
import {styles} from "../../ui/styles";
import {useUpdateSettingProps} from "./useUpdateSetting";
import {ToggleSetting} from "./ToggleSetting";
import {makeModal} from "./Modal";

export const Settings = () => {

    return (
        <View style={styles.modal}>
            <ToggleSetting
                {...useUpdateSettingProps('isSoundOn')}
                text={"Sound Effects"}
                iconName={(value) => value ? "volume-2" : "volume-off"}
            />
            <ToggleSetting
                {...useUpdateSettingProps('isShowCheck')}
                text={"Auto Check"}
                iconName={(value) => value ? "check" : "ban"}
            />
            <ToggleSetting
                {...useUpdateSettingProps('isLockCorrect')}
                text={"Lock Correct Colors"}
                iconName={(value) => value ? "lock" : "lock-open"}
            />
        </View>
    )

};

export const SettingsModal = makeModal(Settings);
