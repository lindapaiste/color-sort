import React, {PropsWithChildren} from "react";
import {AnimatedLocation, IsEither, OverlayProps, TimedLocation} from "./types";
import {mapTimedLocation} from "./withTimedPosition";
import {RPositioned} from "./Positioned";
import {omit} from "lodash";

export const isTimedLocation = <P extends IsEither<TimedLocation, AnimatedLocation>>(props: P): props is TimedLocation & P => {
    return props.hasOwnProperty('timer');
};

export const ROverlayPosition = (props: PropsWithChildren<OverlayProps>) => {
    const animated = isTimedLocation(props) ? mapTimedLocation(props) : props as AnimatedLocation;
    return (
        <RPositioned
            {...omit(props, ['start', 'end'])}
            top={animated.pageY}
            left={animated.pageX}
        />
    )
};
