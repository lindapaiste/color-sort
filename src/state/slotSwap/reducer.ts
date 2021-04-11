import {BoxSwapState as State, LevelLayout, SetLevelPayload, TouchState} from "./types";
import {last} from "lodash";
import {swapIndexes} from "../../util/array-edit";
import {createSlice, Draft, PayloadAction} from "@reduxjs/toolkit";
import {LayoutRectangle} from "react-native";
import {CompleteSlot, OverlayData, OverlayType, PageLocation} from "../../components/level-touch/types";
import {deltaX, findIsInCircle} from "../../components/level-touch/calc";

const initialTouchState: TouchState = {
    isTouching: false,
    isDrag: false,
}

const initialState: State = {
    touch: initialTouchState,
    balls: [],
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

/**
 * helper function because many interactions involve stopping the touch state
 */
const terminateTouch = (state: Draft<State>) => {
    state.touch = initialTouchState;
}

/**
 * TODO
 */
const findSlotAtLocation = (state: Draft<State>, location: PageLocation): CompleteSlot | null => {
    const {slotSize, diameter} = state.layout;
    const slots = state.slots;
    return findIsInCircle(slotSize, diameter)([...slots])(location.pageX, location.pageY);
}

/**
 * defaults to point (0,0) in unexpected case that the slot is undefined
 */
const getLocationForSlot = (state: Draft<State>, slotId: number): PageLocation => {
    const location = state.slots[slotId];
    if (!location) {
        console.error("cannot find location for slot # " + slotId);
        return {pageY: 0, pageX: 0};
    }
    return location;
}

/**
 * helper for generating overlay ball props for each of the swap pair
 */
const createSwapPair = (state: Draft<State>, primary: number, secondary: number, overlayType: OverlayType): OverlayData[] => {
    const primaryLoc = getLocationForSlot(state, primary);
    const secondaryLoc = getLocationForSlot(state, secondary);
    return [{
        // primary
        slot: primary,
        start: primaryLoc,
        end: secondaryLoc,
        isPrimary: true,
        overlayType,
    }, {
        // secondary
        slot: secondary,
        start: secondaryLoc,
        end: primaryLoc,
        isPrimary: false,
        overlayType
    }];
}

const boxSwapSlice = createSlice({
    name: "boxSwap",
    initialState,
    reducers: {
        //---------------------------------//
        touchStarted: (state, action: PayloadAction<PageLocation & { timestamp: number }>) => {
            const slot = findSlotAtLocation(state, action.payload);
            if (slot) {
                state.touch.isTouching = true;
                state.touch.isDrag = false;
                state.touch.touchStart = {
                    ...action.payload,
                    slotId: slot.slot,
                    slotPageX: slot.pageX,
                    slotPageY: slot.pageY,
                };
            } else {
                terminateTouch(state);
            }
        },
        // probably not needed
        touchBecameTap: (state) => {
            state.touch.isDrag = false;
        },
        touchBecameDrag: (state) => {
            state.touch.isDrag = true;
        },
        touchRejected: (state) => {
            terminateTouch(state);
            // TODO: animated dragging ball back to home
        },
        touchReleased: (state, action: PayloadAction<PageLocation & { timestamp: number }>) => {
            const target = findSlotAtLocation(state, action.payload);
            const targetId = target?.slot;
            const {isDrag, touchStart, pressed} = state.touch;

            /**
             * all cases will end the touch
             */
            state.touch.isTouching = false;
            delete state.touch.hoveringOver;

            /**
             * this shouldn't happen, but it's a problem if no touchStart was set
             */
            if (!touchStart) {
                console.warn("no touch start location");
                return;
            }

            /**
             * when releasing from a drag, need to find the target that it was released to
             * if there is a target, begin the swap between the gesture slot and the target slot
             * if not, return the ball to its initial position
             */
            if (isDrag) {

                /**
                 * the pageX/Y for the slot that the ball is dragging from
                 */
                const {slotId, slotPageX, slotPageY} = touchStart;

                /**
                 * how much we have moved during this touch
                 */
                const {dx, dy} = deltaX(touchStart, action.payload);

                /**
                 * takes the current touch position and the start touch position and applies
                 * to the slot location to get the slot pageX/Y corresponding to the touch
                 * can't just use the location directly because the touch has an offset in the slot
                 */
                const translatedLocation = {
                    pageX: slotPageX + dx,
                    pageY: slotPageY + dy,
                }

                /**
                 * return to start if not releasing at a valid slot, or if releasing at the same slot
                 */
                if (!targetId || targetId === touchStart.slotId) {
                    state.touch.overlay = [
                        {
                            slot: slotId,
                            //TODO: double check this - used slotTranslatedLocation in SwapController to subtract the offset inside the ball
                            start: translatedLocation,
                            end: {
                                pageX: slotPageX,
                                pageY: slotPageY,
                            },
                            isPrimary: true,
                            overlayType: OverlayType.RETURNING,
                        }
                    ];
                }
                /**
                 * swap move is not symmetric
                 * the dragged balls starts from its current/translated position rather than the touch start position
                 * touchLocation will be in the middle of the ball, but need to pass the top left corner of the slot
                 */
                else {
                    state.touch.overlay = createSwapPair(state, slotId, targetId, OverlayType.DRAG_SWAP);
                    //override the swap start position to the current position
                    state.touch.overlay[0].start = translatedLocation;
                }
            }


            /**
             * when releasing from tap, will process as either first or second tap based on state of pressed
             */
            else {
                /**
                 * can assume that the release target is the same as the gesture target because if it had moved
                 * it would already be considered not a tap
                 * however there is a chance that responderTarget is still being computed
                 */

                /**
                 * activate slot on first press
                 */
                if (!pressed) {
                    state.touch.pressed = touchStart.slotId;
                }
                /**
                 * deactivate on repeat press of same slot
                 * or on outside click
                 */
                else if (! targetId || pressed === targetId) {
                    delete state.touch.pressed;
                }
                /**
                 * swap on second press
                 * move target slot to first pressed position
                 * move pressed slot to target position
                 */
                else {
                    state.touch.overlay = createSwapPair(state, pressed, targetId, OverlayType.TAP_SWAP);
                }
            }
        },
        hoveredOverSlot: (state, action: PayloadAction<number | undefined>) => {
            state.touch.hoveringOver = action.payload;
        },
        swapBegan: (state, action) => {
        },
        swapEnded: (state, action) => {

        },

        //---------------------------------//
        setLevelLayout: (state, action: PayloadAction<LevelLayout>) => {
            state.layout = action.payload;
            terminateTouch(state);
        },
        registerSlotLayout: (state, action: PayloadAction<{ id: number; location: PageLocation }>) => {
            const {id, location} = action.payload;
            state.slots[id].pageX = location.pageX;
            state.slots[id].pageY = location.pageY;
        },
        setLevel: (state, action: PayloadAction<SetLevelPayload>) => {
            const {balls, boxes, levelId, timestamp} = action.payload;
            terminateTouch(state);
            state.stats = {
                moves: 0,
                levelId,
                startTime: timestamp,
            };
            state.boxes = boxes;
            // an array with one element, which gets filled in the next step
            state.locHistory = [[]];
            // need to clear previous before setting in case current arrays are shorter
            state.balls = [];
            state.slots = [];
            // data needed for slot
            const {ballsPerRow, rowsPerBox} = state.layout;
            const perBox = ballsPerRow * rowsPerBox;
            // loop through balls
            balls.forEach((ball, i) => {
                state.balls[ball.id] = ball;
                state.locHistory[0][ball.initialSlot] = ball.id;
                // create an initial state for slots which will be overwritten when the slot layout is registered
                state.slots[i] = {
                    column: i % ballsPerRow,
                    row: Math.floor( i / ballsPerRow ),
                    boxId: Math.floor( i / perBox ),
                    pageX: 0,
                    pageY: 0,
                }
            })
        },
        swapBallIds: (state, action: PayloadAction<[number, number]>) => {
            const [a, b] = action.payload;
            terminateTouch(state);
            state.stats.moves++;
            const current = last(state.locHistory);
            state.locHistory.push(
                current!.map(id => id === a ? b : id === b ? a : id)
            )
        },
        swapSlotBalls: (state, action: PayloadAction<[number, number]>) => {
            const [a, b] = action.payload;
            /**
             * TODO: want to only count it as a move if the location has changed, ignoring changes to position
             * but this info is not currently included in the action
             */
            terminateTouch(state);
            state.stats.moves++;
            const current = last(state.locHistory);
            state.locHistory.push(
                swapIndexes(current!, a, b)
            )
        },
        restart: (state, action: PayloadAction<{timestamp: number}>) => {
            terminateTouch(state);
            state.stats.moves = 0;
            state.stats.startTime = action.payload.timestamp;
            state.locHistory.splice(1);
        },
        undo: (state) => {
            terminateTouch(state);
            // in case of undo on 0 moves
            state.stats.moves = Math.min(0, state.stats.moves - 1);
            // TODO: do I need to guard here too? Or can I assume that undo won't be called?
            state.locHistory.splice(-1);
        }
    }
});

export const {
    setLevelLayout,
    setLevel,
    restart,
    undo,
    registerSlotLayout,
    swapBallIds,
    swapSlotBalls,
    touchStarted,
    touchReleased,
    touchRejected,
    touchBecameDrag,
    hoveredOverSlot
} = boxSwapSlice.actions;

export const reducer = boxSwapSlice.reducer;