import {SettingsShape} from "../../state/user/types";
import {useDispatch} from "react-redux";
import {useSelector} from "../../state";
import {selectSetting} from "../../state/user/selectors";
import {updateSettings} from "../../state/user/reducer";
import {useCallback} from "react";

export interface EditProps<T, ST = T> {
    value: T;

    setValue(value: ST): void;
}

export const useUpdateSettingProps = <K extends keyof SettingsShape>(setting: K): EditProps<SettingsShape[K]> => {

    const dispatch = useDispatch();

    const value = useSelector(selectSetting(setting));

    const setValue = useCallback((value: SettingsShape[K]) => {
        dispatch(updateSettings({[setting]: value}));
    }, [dispatch, setting]);

    return {value, setValue};
};
