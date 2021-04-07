import React from "react";
import {RGB} from "../../util/color-util";
import {useLevelSelector} from "../../state";
import {getBallColor} from "../../state/level/selectors";
import {RenderBall, Props as RenderProps} from "./RenderBall";

export const useBallColor = (id: number): RGB => {
    return useLevelSelector(getBallColor(id))
};

export interface PropId {
    id: number,
}

export type Props = Omit<RenderProps, 'color'> & PropId

export const Ball = ({id, ...props}: PropId & Pick<RenderProps, 'diameter'>) => (
    <RenderBall
        {...props}
        color={useBallColor(id)}
    />
);
