import {Animated} from "react-native";

/**
 * press e.NativeEvent locationX/Y gives the spot within the circle that was pressed
 * pageX/Y gives the coordinates relative to the page
 */
export interface StandardEventLocation {
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
}

export interface XY {
    x: number;
    y: number;
}

export interface PageLocation {
    pageX: number;
    pageY: number;
}

export interface AbsoluteLocation {
    absoluteX: number;
    absoluteY: number;
}

export interface Offset {
    top: number;
    left: number;
}

export interface DeltaXY {
    dx: number;
    dy: number;
}

export type AnimatedOffset =  Animated.AnimatedProps<Offset>
export type AnimatedLocation =  Animated.AnimatedProps<PageLocation>

export interface Range {
    min: number;
    max: number;
}

export interface SlotGrid {
    columns: number[]; //the start X of each column
    rows: number[]; //the start Y of each row
    slotSize: number;
}

export type Pair<T> = [T, T];

export type ExecuteSwap = (a: number, b: number) => void;

export interface RegisteredSlot extends PageLocation {
    disabled?: boolean;
}

export interface CompleteSlot extends RegisteredSlot {
    slot: number;
}

//do this so that it knows all of the possible properties
export interface TimedOffset {
    start: Offset;
    end: Offset;
    timer: Animated.Value;
}

export interface TimedLocation {
    start: PageLocation;
    end: PageLocation;
    timer: Animated.Value;
}

export type IsEither<A, B> = (A | B) & Partial<A> & Partial<B>



export interface PositionProps extends AnimatedOffset {
    containerOffset?: Offset;
}

interface OverlayShared {
    slot: number;
    overlayType: OverlayType;
    isPrimary: boolean;
}

export interface OverlayData extends OverlayShared {
    start: PageLocation;
    end: PageLocation;
}

export type OverlayProps = IsEither<TimedLocation, AnimatedLocation> & OverlayShared;

export enum OverlayType {
    DRAGGING,
    RETURNING,
    TAP_SWAP,
    DRAG_SWAP,
}

export interface ControllerSlotProps {
    isDragging: boolean;
    isPressed: boolean;
    isSwapping: boolean;
    isOverlay: boolean;
}

export type SlotArray = Array<RegisteredSlot | undefined>;
export type RegisterFunction = (slot: number, location: PageLocation) => void;

export interface PropSlot {
    slot: number;
}

export interface SlotFinder {
    (x: number, y: number): CompleteSlot | null
}