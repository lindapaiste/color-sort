import {PageLocation, RegisteredSlot, SlotArray, SlotGrid} from "./types";
import {uniq} from "lodash";

export const makeSlotGrid = (slotAreas: SlotArray, slotSize: number): SlotGrid => {
    const defined = slotAreas.filter(a => a !== undefined) as Array<RegisteredSlot>;
    const columns = uniq(defined.map(({pageX}) => pageX));
    const rows = uniq(defined.map(({pageY}) => pageY));
    return {
        columns,
        rows,
        slotSize,
    }
};
export const findGridDimension = (value: number, starts: number[], slotSize: number): number | null => {
    // still not the absolute fastest.  that would be starting in the middle and continually halving
    // could also assumes that starts are in order from smallest to largest and return null if in between slots or outside range
    return starts.findIndex(start => value >= start && value <= start + slotSize);
};
export const findGridSlot = ({pageX, pageY}: PageLocation, grid: SlotGrid): number | null => {
    const columnIndex = findGridDimension(pageX, grid.columns, grid.slotSize);
    if (columnIndex === null) return null;
    const rowIndex = findGridDimension(pageY, grid.rows, grid.slotSize);
    if (rowIndex === null) return null;
    const ballsPerRow = grid.columns.length;
    return rowIndex * ballsPerRow + columnIndex;
};
