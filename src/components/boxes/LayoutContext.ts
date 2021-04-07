import {createContext, FunctionComponent, useContext} from "react";
import {BoxSizes, LayoutSettings} from "./calcSizing";
import {PropSizing} from "./RenderLevel";

export interface Layout extends BoxSizes, LayoutSettings {

}

export const LayoutContext = createContext<Layout | undefined>(undefined);

//could store in redux and replace this hook
export const useLayout = (): Layout | undefined => {
    return useContext(LayoutContext);
};

export const withSizing = <Props extends Partial<Layout>>(Component: FunctionComponent<Props>): FunctionComponent<Omit<Props, keyof Layout>> =>
    (props) => {
    const sizing = useLayout();
    if ( sizing === undefined ) {
        console.error( "no layout found -- component must be inside a LayoutContext provider" );
        return null;
    }
    return Component({...props, ...sizing} as Props);
    };
