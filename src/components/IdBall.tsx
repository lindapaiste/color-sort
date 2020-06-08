import React from "react";
import {Color} from "../util/color-util";
import {useSelector} from "react-redux";
import {getBallColor} from "../state/level/selectors";
import {ColorBall, Props as RenderProps} from "./ColorBall";

export const useBallColor = (id: number): Color => {
    return useSelector(getBallColor(id))
};

export interface PropId {
    id: number,
}

export type Props = Omit<RenderProps, 'color'> & PropId

export const IdBall = ({id, ...props}: Props) => (
    <ColorBall
        {...props}
        color={useBallColor(id)}
    />
);