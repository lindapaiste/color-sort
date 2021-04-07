import {Offset, StandardEventLocation, PageLocation} from "./types";
import {I_Point} from "../animated/DragOrTap";

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

export const xyToOffset = ({x, y}: I_Point): Offset => ({top: y, left: x});

export const offsetToXY = ({top, left}: Offset): I_Point => ({y: top, x: left});
