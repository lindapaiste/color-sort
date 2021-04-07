import React from "react";
import {View} from "react-native";
import {styles} from "../../ui/styles";
import {ScaleDraggableBall} from "../animated/DraggableBall";
import {BallProps, LOCATIONS} from "../../state/level/types";

export interface Props {
    balls: BallProps[];
    location: LOCATIONS;
    showAll: boolean;
}

//TODO: diameter from context


export const BallPile = ({balls, location, showAll}: Props) => {
    return (
        <View style={styles.ballPile}>
            {balls.map((props, i) => {
                if ( ! showAll && i > 0) {
                     return null;
                }
                return (
                    <ScaleDraggableBall
                        {...props}
                        key={props.id}
                    />
                )
            })}
        </View>
    );
};
