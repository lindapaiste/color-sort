import {FunctionComponent} from "react";
import {useBoxSwapLevelSelector} from "../../state";
import {getLayout} from "../../state/slotSwap/selectors";
import {LevelLayout} from "../../state/slotSwap/types";

export const useLayout = (): LevelLayout => {
    return useBoxSwapLevelSelector(getLayout)
};

export const withSizing = <Props extends Partial<LevelLayout>>(Component: FunctionComponent<Props>): FunctionComponent<Omit<Props, keyof LevelLayout>> =>
    (props) => {
        const sizing = useLayout();
        return Component({...props, ...sizing} as Props);
    };
