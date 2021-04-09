import {
    BoxSwapState as State,
    LevelLayout,
    SetLevelPayload
} from "./types";
import {last} from "lodash";
import {swapIndexes} from "../../util/array-edit";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {LayoutRectangle} from "react-native";

const initialState: State = {
    active: {},
    balls: {},
    boxes: [],
    locHistory: [],
    /**
     * use 1 as default instead of 0 to ensure no divide by 0 errors
     */
    layout: {
        slotSize: 1,
        diameter: 1,
        boxCount: 1,
        ballsPerRow: 1,
        rowsPerBox: 1,
        boxPadding: 0,
    },
    slots: [],
    stats: {
        startTime: Date.now(),
        moves: 0,
        levelId: -1
    }
};

const boxSwapSlice = createSlice({
    name: "boxSwap",
    initialState,
    reducers: {
        setLevelLayout: (state, action: PayloadAction<LevelLayout>) => {
            state.layout = action.payload;
            state.active = {};
        },
        setSlotLayout: (state, action: PayloadAction<{id: number; layout: LayoutRectangle}>) => {
            state.slots[action.payload.id] = action.payload.layout;
        },
        setActiveBall: (state, action: PayloadAction<number>) => {
            state.active.tappedSlotId = action.payload;
        },
        setLevel: (state, action: PayloadAction<SetLevelPayload>) => {
            const {balls, boxes, levelId, timestamp} = action.payload;
            state.active = {};
            state.stats = {
                moves: 0,
                levelId,
                startTime: timestamp,
            };
            state.boxes = boxes;
            // an array with one element, which gets filled in the next step
            state.locHistory = [[]];
            balls.forEach( ball => {
                state.balls[ball.id] = ball;
                state.locHistory[0][ball.initialSlot] = ball.id;
            }) // or keyBy(balls, b => b.id);
        },
        swapBallIds: (state, action: PayloadAction<[number, number]>) => {
            const [a, b] = action.payload;
            state.active = {};
            state.stats.moves++;
            const current = last(state.locHistory);
            state.locHistory.push(
                current!.map(id => id === a ? b : id === b ? a : id)
            )
        },
        swapSlotBalls: (state, action:  PayloadAction<[number, number]>) => {
            const [a, b] = action.payload;
            /**
             * TODO: want to only count it as a move if the location has changed, ignoring changes to position
             * but this info is not currently included in the action
             */
            state.active = {};
            state.stats.moves++;
            const current = last(state.locHistory);
            state.locHistory.push(
                swapIndexes(current!, a, b)
            )
        },
        restart: (state, action) => {
            state.active = {};
            state.stats.moves = 0;
            state.stats.startTime = action.payload.timestamp;
            state.locHistory.splice(1);
        },
        undo: (state) => {
            state.active = {};
            // in case of undo on 0 moves
            state.stats.moves = Math.min(0, state.stats.moves - 1);
            // TODO: do I need to guard here too? Or can I assume that undo won't be called?
            state.locHistory.splice(-1);
        }
    }
});

export const {setLevelLayout, setLevel, restart, undo, setActiveBall, setSlotLayout, swapBallIds, swapSlotBalls} = boxSwapSlice.actions;

export const reducer = boxSwapSlice.reducer;