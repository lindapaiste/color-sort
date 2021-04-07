import React, {ComponentType, FunctionComponent, useState} from "react";
import {LayoutChangeEvent, View, ViewProps} from "react-native";
import {LayoutRectangle} from "react-native";
import {useDispatch} from "react-redux";
import {LOCATIONS, ZoneId} from "../../state/level/types";
import {setZoneLayout} from "../../state/level/actions";

export interface PropZoneId {
    zoneId: ZoneId;
}
/**
 * wrapping a view will mess with Flexbox layout
 * instead want to get the layout from the inner/child component
 * but this requires that the component must be a View or other component accepting prop 'onLayout'
 */
export const DropZone: FunctionComponent<PropZoneId> = ({children, zoneId}) => {

    return (
        <View onLayout={useOnLayout(zoneId)}>
            {children}
        </View>
    )
};

export const useOnLayout = (zoneId: ZoneId): (event: LayoutChangeEvent) => void => {
    const dispatch = useDispatch();

    return (e: LayoutChangeEvent) => {
        dispatch(setZoneLayout(zoneId, e.nativeEvent.layout));
    }
};

export const withOnLayout = <P extends Pick<ViewProps, 'onLayout'> & PropZoneId>(Component: FunctionComponent<P>): FunctionComponent<Omit<P, 'onLayout'>> =>
    (props) => {
        const onLayout = useOnLayout(props.zoneId);
        return Component({...props, onLayout} as P);
    };
