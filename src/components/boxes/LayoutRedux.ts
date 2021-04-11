import {FunctionComponent} from "react";
import {useSelector} from "../../state";
import {selectLayout} from "../../state/slotSwap/selectors";
import {LevelLayout} from "../../state/slotSwap/types";

export const useLayout = (): LevelLayout => {
    return useSelector(selectLayout)
};

export const withSizing = <Props extends Partial<LevelLayout>>(Component: FunctionComponent<Props>): FunctionComponent<Omit<Props, keyof LevelLayout>> =>
    (props) => {
        const sizing = useLayout();
        return Component({...props, ...sizing} as Props);
    };
