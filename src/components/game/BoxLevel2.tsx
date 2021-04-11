import React, {useCallback, useEffect} from "react";
import {RenderLevel} from "../boxes/RenderLevel2";
import {useDispatch} from "react-redux";
import {useSelector} from "../../state";
import {useDimensions} from "../../ui/vwHooks";
import {calcSizing} from "../boxes/calcSizing";
import {PlayGeneratesProps} from "./PlayScreen";
import {selectIsWin, selectLayout, selectLevelId} from "../../state/slotSwap/selectors";
import {setLevel, swapSlotBalls} from "../../state/slotSwap/reducer";
import {setLevelLayout} from "../../state/slotSwap/reducer";
import {SwapController} from "../level-touch/SwapController";
import {ExecuteSwap, SlotArray} from "../level-touch/types";
import {RenderOverlayBall} from "../boxes/OverlayBall";
import {BallData, BoxData} from "../../state/slotSwap/types";
import {findIsInCircle} from "../level-touch/calc";

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

    const noErrors = useSelector(selectIsWin);
    const playingLevel = useSelector(selectLevelId);
    const isWin = noErrors && id === playingLevel;

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
            dispatch(setLevel({balls, boxes, levelId: id, timestamp: Date.now()}));
        },
        [balls, boxes, id]
    );

    /**
     * generate functions for SwapController
     */
    const executeSwap: ExecuteSwap = useCallback((a, b) => {
        console.log("swapping", a, b);
        dispatch(swapSlotBalls([a, b]));
    }, [dispatch]);

    /**
     * will reload when dimensions change
     * first load is always a fail because layout won't be set yet
     */
    const {diameter, slotSize} = useSelector(selectLayout);

    const findTarget = useCallback(
        (x: number, y: number, slots: SlotArray) => findIsInCircle(slotSize, diameter)(slots)(x, y)
        , [diameter, slotSize]);

    console.log("BoxLevel re-rendered");

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
