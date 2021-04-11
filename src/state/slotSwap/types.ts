import {Animated, GestureResponderHandlers, LayoutRectangle} from "react-native";
import {BoxSizes, LayoutSettings} from "../../components/boxes/calcSizing";
import {CompleteSlot, OverlayData, OverlayProps, PageLocation} from "../../components/level-touch/types";
import {ReleaseLocation} from "../../components/level-touch/usePanTouch";
import {useState} from "react";

/**
 * want to store:
 * index of colors & correct boxes for ball id
 * which ball is in each slot
 * dimensions/position of each slot
 * ? which slots are in each box ?
 */

export type ZoneId = number | string;

export const EMPTY_RECTANGLE: LayoutRectangle = {
    x: 0,
    y: 0,
    width: 0,
    height: 0,
};

/**
 * the immutable properties
 */
export interface BallData {
    id: number;
    color: string;
    correctBox: number;
    initialSlot: number;
}

export interface BoxData {
    color: string;
}

export interface LocatedBall {
    id: number;
    slot: number;
}

export interface LevelLayout extends LayoutSettings, Pick<BoxSizes, 'diameter' | 'slotSize' | 'boxPadding'> {
}

export type HistoryShape = Array<SlotMap>;
export type SlotLayoutShape = Array<LayoutRectangle>;
export type BoxesShape = BoxData[];
//key by id for easy lookup, but also keep the id as a property for easy mapping
export type BallsShape = Record<number, BallData>;

export interface LevelStats {
    startTime: number;
    moves: number;
    levelId: number;
}

export interface StartLocation extends PageLocation {
    slotPageX: number;
    slotPageY: number;
    slotId: number;
    timestamp: number;
}

export interface TouchState {
    /**
     * the location where the touch began
     * should always have a slotId because don't save the start if not on a slot
     */
    touchStart?: StartLocation;
    /**
     * the location where the finger was lifted
     * includes failed touches, but adds prop isSuccess to distinguish
     */
    touchRelease?: ({slotId?: number; timestamp: number;} & ReleaseLocation);
    /**
     * whether the current or just ended touch is a drag rather than a tap
     */
    isDrag: boolean;
    /**
     * whether or not the touch is active right now
     */
    isTouching: boolean;
    /**
     * the id of the slot which is being hovered over currently
     */
    hoveringOver?: number;
    /**
     * save the pressed slot, which is awaiting a second tap
     */
    pressed?: number;
    /**
     * for a tap pair, both balls are treated the same so a tuple of 2 ids is fine as order doesn't matter
     * for a drag swap, target vs. pressed matters because need to know which to apply the translate to
     */
    overlay?: OverlayData[];
}

export interface SetLevelPayload {
    balls: BallData[];
    boxes: BoxData[];
    levelId: number;
    timestamp: number;
}

export interface SlotData extends PageLocation {
    boxId: number;
    row: number;
    column: number;
}

export interface BoxSwapState {
    /**
     * key by id for easy lookup, but also keep the id as a property for easy mapping
     */
    balls: BallData[];
    /**
     * an array of arrays
     * each array is a map where the key is the slotId and the value is the ballId in that slot
     */
    locHistory: SlotMap[];
    /**
     * increment the number of moves, etc.
     */
    stats: LevelStats;
    /**
     * array keyed by slotId with information about each slot, including the position
     */
    slots: SlotData[];
    /**
     * data for each box
     */
    boxes: BoxData[];
    /**
     * store the id of the currently active ball and the current hover target
     */
    touch: TouchState;
    /**
     * numbers regarding the positioning of items on the screen
     */
    layout: LevelLayout;
}

export type SlotMap = Array<number>;