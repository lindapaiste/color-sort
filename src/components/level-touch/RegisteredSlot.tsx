import React, {PropsWithChildren, useEffect} from "react";
import {View} from "react-native";
import {slotDimensions} from "../boxes/BallSlot";
import {useComponentLocation} from "./useComponentLocation";
import {useLayout} from "../boxes/LayoutRedux";
import {PropSlot, RegisterFunction} from "./types";
import {useRegisterSlot} from "./ControllerContext";
import {styles} from "../../ui/styles";

/**
 * can use onLayout event to get height/width and X/Y relative to the parent
 * but onLayout does not have access to pageX/Y
 *
 * if pageX/Y is needed, need to use refs to call measure() on the native View
 */

export interface Props {
    slot: number;
    register: RegisterFunction;
    slotSize: number; //or can pass slotStyle through some sort of stylesheet context
}

export const RRegisteredSlot = ({slot, register, slotSize, children}: PropsWithChildren<Props>) => {

    const {ref, onLayout, location} = useComponentLocation();

    useEffect(() => {
        if (location) {
            register(slot, location);
        }
        //could do a de-register clean-up
    }, [location, slotSize]);


    //cannot just pass off to RBallSlot because would need to forward ref
    return (
        <View
            key={slot}
            ref={ref}
            onLayout={onLayout}
            style={[
                styles.centerContents,
                slotDimensions(slotSize),
            ]}
        >
            {children}
        </View>
    )
};

export const CRegisteredSlot = ({slot, children}: PropsWithChildren<PropSlot>) => {
    const register = useRegisterSlot();
    const {slotSize} = useLayout();
    return RRegisteredSlot({register, slotSize, slot, children});
};
