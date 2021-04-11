import {
    CompleteSlot,
    DeltaXY,
    Offset,
    PageLocation,
    RegisteredSlot,
    SlotArray, SlotFinder,
    StandardEventLocation,
    XY
} from "./types";
import {MOVE_MIN_DISTANCE} from "./constants";

/**
 * press e.NativeEvent locationX/Y gives the spot within the circle that was pressed
 * pageX/Y gives the coordinates relative to the page
 * when applying transform translate to an absolute positioned item,
 * need to know the top and left for its parent
 */

export const eventTargetOffset = (e: StandardEventLocation): Offset => ({
    top: e.pageY - e.locationY,
    left: e.pageX - e.locationX,
});

export const relativeOffset = (inner: Offset, container: Offset = {top: 0, left: 0}): Offset => ({
    top: inner.top - container.top,
    left: inner.left - container.left,
});

export const pageXyToOffset = ({pageY, pageX}: PageLocation): Offset => ({top: pageY, left: pageX});

export const offsetToPageXy = ({top, left}: Offset): PageLocation => ({pageY: top, pageX: left});

export const xyToOffset = ({x, y}: XY): Offset => ({top: y, left: x});

export const offsetToXY = ({top, left}: Offset): XY => ({y: top, x: left});

export const deltaX = (initial: PageLocation, final: PageLocation): DeltaXY =>({
    dx: final.pageX - initial.pageX,
    dy: final.pageY - initial.pageY
})

export const isExceededMoveThreshold = ({dx, dy}: DeltaXY, moveMinDistance = MOVE_MIN_DISTANCE): boolean => {
    const distance = Math.sqrt(dx * dx - dy * dy);
    return distance > moveMinDistance;
};

/**
 * could define this is a very generic and extensible way where every slot has a width and height,
 * but that seems silly when the size is the same for all of them
 * also if I store a fixed value it could become outdated
 *
 * want to minimize the amount of computations
 * can do this by looking at row/column rather than checking each slot individually
 *
 * could store this data in redux, or could store it in state
 *
 * slotSize might change on resize -- unlikely but possible
 *
 *
 * should save disabled/enabled here?  or figure out further up the chain?
 *
 * is it better to use numeric slot ids vs refs, or is it all the same?
 */

export const slotContains = (slotSize: number) => (x: number, y: number) => (slot: PageLocation | undefined): boolean => {
    return (
        slot !== undefined &&
        x > slot.pageX &&
        x < slot.pageX + slotSize &&
        y > slot.pageY &&
        y < slot.pageY + slotSize
    );
};
export const circleContains = (diameter: number) => (x: number, y: number) => (slot: PageLocation): boolean => {
    //find the distance from the center of the circle to the point and see if it is less than the radius
    const center = {
        x: slot.pageX + .5 * diameter,
        y: slot.pageY + .5 * diameter,
    };
    const distance = Math.sqrt(Math.pow(x - center.x, 2) + Math.pow(y - center.y, 2));
    console.log({distance, center, x, y, diameter});
    return distance < .5 * diameter;
};
export const findIsInSlot = (slotSize: number) => (slots: SlotArray): SlotFinder => (x: number, y: number): CompleteSlot | null => {
    //will never be more than one slot
    const i = slots.findIndex( slotContains(slotSize)(x, y) );
    return i === -1 ? null : {
        ...slots[i] as RegisteredSlot,
        slot: i
    };
};
export const findIsInCircle = (slotSize: number, diameter: number) => (slots: SlotArray): SlotFinder => (x: number, y: number): CompleteSlot | null => {
    //console.log(slots);
    //do this rather than mapping to circleContains because if it is in the slot for a slot but not in the circle then do not need to check any other circles
    const slot = findIsInSlot(slotSize)(slots)(x, y);
    //console.log(slot);
    return slot !== null && circleContains(diameter)(x, y)(slot) ? slot : null;
};