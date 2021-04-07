import React, {useCallback, useEffect} from "react";
import {RenderLevel} from "../boxes/RenderLevel2";
import {useDispatch} from "react-redux";
import {useBoxSwapLevelSelector} from "../../state";
import {useDimensions} from "../../ui/vwHooks";
import {calcSizing} from "../boxes/calcSizing";
import {PlayGeneratesProps} from "./PlayScreen";
import {getIsWin, getLevelId} from "../../state/slotSwap/selectors";
import {setLevelBalls, setLevelLayout, swapSlotBalls} from "../../state/slotSwap/actions";
import {SwapController} from "../level-touch/SwapController";
import {ExecuteSwap, SlotArray} from "../level-touch/types";
import {findIsInCircle} from "../level-touch/useFindTarget";
import {useLayout} from "../boxes/LayoutRedux";
import {RenderOverlayBall} from "../boxes/OverlayBall";
import {BallData, BoxData} from "../../state/slotSwap/types";

export interface BoxLevelProps {
    boxes: BoxData[];
    balls: BallData[];
    ballsPerRow: number;
    rowsPerBox: number;
}

/**
 * handles dispatching of game-level cycle events and loading of data into redux
 *
 * generating of balls should happen higher up
 */

export const BoxLevel = (props: BoxLevelProps & PlayGeneratesProps) => {

    const {id, boxes, balls, ballsPerRow, rowsPerBox, onWin} = props;

    const noErrors = useBoxSwapLevelSelector(getIsWin);
    const playingLevel = useBoxSwapLevelSelector(getLevelId);
    const isWin = noErrors && id === playingLevel;

    console.log({noErrors, playingLevel, id, isWin});

    //will useEffects be evaluated in order?
    //only evaluated when isWin changes, so should be looked at
    // when the game is reset and isWin becomes false and again when it is won
    useEffect(
        () => {
            if (isWin) {
                onWin();
            }
        }, [isWin, id]
    );

    const dispatch = useDispatch();

    const screen = useDimensions();

    const boxCount = boxes.length;

    /**
     * calculate sizing and dispatch to redux
     * includes dimensions of diameter, etc.
     * recompute if screen changes or if layout of boxes changes
     * can persist across levels with same box layout
     */
    useEffect(() => {
            const inputs = {boxCount, ballsPerRow, rowsPerBox};
            const computed = calcSizing({area: {...screen, height: .9 * screen.height}, ...inputs});  //TODO: needs to account for menu size
            dispatch(setLevelLayout({
                ...computed,
                ...inputs
            }));
        },
        [screen.width, screen.height, boxCount, ballsPerRow, rowsPerBox]
    );

    /**
     * dispatch ball/box data to redux when the level changes
     */
    useEffect(
        () => {
            dispatch(setLevelBalls(balls, boxes, id));
        },
        [balls, boxes, id]
    );

    /**
     * generate functions for SwapController
     */
    const executeSwap: ExecuteSwap = (a, b) => {
        console.log("swapping", a, b);
        dispatch(swapSlotBalls(a, b));
    };

    /**
     * will reload when dimensions change
     * first load is always a fail because layout won't be set yet
     */
    const {diameter, slotSize} = useLayout();
    const findTarget = useCallback(
        (x: number, y: number, slots: SlotArray) => findIsInCircle(slotSize, diameter)(slots)(x, y)
        , [diameter, slotSize]);

    console.log(useBoxSwapLevelSelector(s => s));

    return (
        <SwapController
            executeSwap={executeSwap}
            findTarget={findTarget}
            RenderOverlayBall={RenderOverlayBall}
            style={{flex: 1}}
        >
            <RenderLevel
                {...props}
            />
        </SwapController>
    )
};
