import {SettingsShape} from "../../state/user/types";
import {useDispatch} from "react-redux";
import {useUserSelector} from "../../state";
import {getSetting} from "../../state/user/selectors";
import {updateSetting} from "../../state/user/actions";

export interface EditProps<T, ST = T> {
    value: T;

    setValue(value: ST): void;
}

export const useUpdateSettingProps = <K extends keyof SettingsShape>(setting: K): EditProps<SettingsShape[K]> => {

    const dispatch = useDispatch();

    const value = useUserSelector(getSetting(setting));

    const setValue = (value: SettingsShape[K]) => {
        dispatch(updateSetting(setting, value));
    };

    return {value, setValue};
};
