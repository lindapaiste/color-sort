import React, {ComponentType, FunctionComponent} from "react";
import {OuterProps} from "./ts";
/**
 * just playing with typescript stuff, and wanting to write my own implementation of recompose withProps
 */


/**
 * create an HOC by providing a PropsCreator function
 */
export const withProps = <CreatedProps extends object, RequiredProps extends object>(propsMapper: (props: RequiredProps) => CreatedProps) => {
    /**
     * the created HOC takes a WrappedComponent which requires the created props
     * and composes it into one that only needs its own props
     * composed component needs Inner - Created + Required
     */
    return <InnerProps extends CreatedProps>(Component: ComponentType<InnerProps>): FunctionComponent<OuterProps<InnerProps, RequiredProps, CreatedProps>> => {
        /**
         * function component which doesn't require created props, but still passes all props down to the wrapped component
         */
        return (props) => {
            const newProps = propsMapper(props);

            const combined = {
                ...props,
                ...newProps,
            };

            return (
                <Component
                    {...combined as unknown as InnerProps}
                />
            )
        };
    }
};

/**
 * trying to figure out how to pass generics to CreatedProps & RequiredProps
 */
