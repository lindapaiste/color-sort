import {DropZoneMap, I_Slot, LOCATIONS} from "../../state/scale/types";
import {LayoutRectangle} from "react-native";
import {useLevelSelector} from "../../state";
import {getDropZones, getLocIdMap} from "../../state/scale/selectors";
import {useLayout} from "../boxes/LayoutRedux";

/**
 *  the release event for a ball needs to know what the drop zones are
 *  could use a local context
 *  could use a dispatch event to store the data in redux
 *  could use a component attached to other components through callbacks
 */

/**
 * when doing swap with taps, need to know the ids ( and Components? ) of both balls
 */

export const findDropZone = (map: Partial<DropZoneMap>) => (x: number, y: number): LOCATIONS | undefined => {
    //iterating over an enum is a nightmare
    /*if ( isInZone(map[LOCATIONS.LEFT])(x,y)) {
        return LOCATIONS.LEFT;
    } else if ( isInZone(map[LOCATIONS.RIGHT])(x,y)) {
        return LOCATIONS.RIGHT;
    } else if ( isInZone(map[LOCATIONS.UNASSIGNED])(x,y)) {
        return LOCATIONS.UNASSIGNED;
    }*/
    //when looping through, numeric keys are cast to strings so must be cast back
    const entry: [string, LayoutRectangle | undefined] | undefined = Object.entries(map).find(
        ([key, value]) => !!value && isInZone(value)(x, y)
    );
    if (entry) {
        return parseInt(entry[0]) as LOCATIONS;
    }
};

export const isInZone = (rect: LayoutRectangle) => (x: number, y: number): boolean => {
    return x > rect.x && x < (rect.x + rect.width) && y > rect.y && y < (rect.y + rect.height);
};

export const findDropSlot = ({zones, slotSize, ballsPerRow, boxPadding}: { zones: Partial<DropZoneMap>, slotSize: number, ballsPerRow: number, boxPadding: number }) => (x: number, y: number): I_Slot | undefined => {

    const location = findDropZone(zones)(x, y);

    if (location === undefined) return undefined;

    const rect = zones[location] as LayoutRectangle;

    const offsetX = x - (rect.x + boxPadding);
    const offsetY = y - (rect.y + boxPadding);

    const columnIndex = Math.min(offsetY / slotSize);
    const rowIndex = Math.min(offsetX / slotSize);


    //note: will yield strange results when the point is in the empty area of an incomplete row
    const position = rowIndex * ballsPerRow + columnIndex;

    return {
        location,
        position
    }
};

type SlotFinder<Args extends any[]> = (...args: Args) => I_Slot | undefined;

/**
 * bug fix for empty area at end causing too high position
 * gets complicated because useFindDropSlot returns a function,
 * so map the whole function
 */
const withUseOverflowFix = <Args extends any[]>(finder: SlotFinder<Args>): SlotFinder<Args> =>
    (...args: Args): I_Slot | undefined => {
        const slot = finder(...args);

        //selecting from redux cannot be conditional
        //so select the whole map because location might not be defined or valid
        const map = useLevelSelector(getLocIdMap);

        if (slot) {
            const maxPosition = (map[slot.location] || []).length;
            return {
                ...slot,
                position: Math.min(maxPosition, slot.position),
            }
        }

        return slot;
    };

/**
 * hook which gets layout from context ans zones from redux
 * returns function of point (x,y)
 */
export const useFindDropSlot = (): (x: number, y: number) => I_Slot | undefined => {

    const zones = useLevelSelector(getDropZones);

    const layout = useLayout();

    return withUseOverflowFix(findDropSlot({...layout, zones}));
};


/**
 * version with all hook calls outside of function
 */
export const useFindDropSlot2 = (): (x: number, y: number) => I_Slot | undefined => {

    const zones = useLevelSelector(getDropZones);

    const layout = useLayout();

    return findDropSlot({...layout, zones});
};
