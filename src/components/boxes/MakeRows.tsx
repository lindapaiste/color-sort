import React, {ComponentType} from "react";
import {BallData} from "../../state/slotSwap/types";
import {chunk} from "lodash";
import {CircleRow} from "./CircleRow";

export interface Props<T extends { id: number } = BallData> {
    balls: T[],
    RenderBall: ComponentType<T>,
    ballsPerRow: number,
}

/**
 * returns a fragment with multiple rows
 */
export const MakeRows = <T extends { id: number }>({balls, RenderBall, ballsPerRow}: Props<T>) => {
    const chunks = chunk(balls, ballsPerRow);
    return (
        <>
            {chunks.map((rowBalls, i) =>
                <CircleRow
                    key={i}
                >
                    {rowBalls.map(ball =>
                        <RenderBall
                            key={ball.id}
                            {...ball}
                        />)}
                </CircleRow>
            )}
        </>
    )
};
