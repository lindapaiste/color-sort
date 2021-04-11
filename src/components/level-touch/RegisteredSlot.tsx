import React, {PropsWithChildren, useCallback, useEffect} from "react";
import {View} from "react-native";
import {slotDimensions} from "../boxes/BallSlot";
import {useComponentLocation} from "./useComponentLocation";
import {PageLocation, PropSlot, RegisterFunction} from "./types";
import {styles} from "../../ui/styles";
import {useSelector} from "../../state";
import {useDispatch} from "react-redux";
import {registerSlotLayout} from "../../state/slotSwap/reducer";
import {selectLayout} from "../../state/slotSwap/selectors";

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
    const dispatch = useDispatch();
    const {slotSize} = useSelector(selectLayout);
    const register = useCallback( (slotId: number, location: PageLocation) => {
        dispatch(registerSlotLayout({id: slotId,location}));
    }, [dispatch]);
    return (
        <RRegisteredSlot
            register={register}
            slotSize={slotSize}
            slot={slot}
            children={children}
        />
    )
};
