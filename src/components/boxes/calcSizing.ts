export interface Size {
    width: number;
    height: number;
}

export interface BoxSizes {
    diameter: number;
    boxPadding: number;
    slotSize: number;
}

export interface LayoutSettings {
    boxCount: number;
    ballsPerRow: number;
    rowsPerBox: number;
}


export interface Box {
    width: number;
    height: number;
    margin: number;
    padding: number;
    borderWidth: number;
    borderLeftWidth: number;
}

/**
 * note: CSS width and height include the padding and border, but not the margin
 */

export const boxOuterWidth = (box: Box): number => box.width + 2 * box.margin;

export const boxInnerWidth = (box: Box): number =>
    box.width - ( 2 * box.padding ) - box.borderWidth - box.borderLeftWidth;

export const boxOuterHeight = (box: Box): number => box.height + 2 * box.margin;

export const boxInnerHeight = (box: Box): number => box.height - 2 * box.padding - 2 * box.borderWidth;


//ball margin should be relative to the size of the ball rather than the size of the screen
export const BALL_MARGIN_PERCENT = .05;

//relative to the screen - space between two boxes or between box and edge - not to be doubled up between boxes
const BOX_AROUND_VW_PERCENT = .05;

//relative to the box
export const BOX_PADDING_PERCENT = .02;//check

//
const BOX_BORDER_PX = 1;

const BOX_BORDER_LEFT_PX = 10;

/**
 * need to know an approximate margin in order to compute the slotSize, however this margin should not be consider exact
 * boxMargin won't be explicitly set - left to flexbox to center
 */
export const calcSizing = ({area, boxCount, ballsPerRow, rowsPerBox}: LayoutSettings & { area: Size }): BoxSizes => {

    //cannot just use vw as basis for box around/margin because it causes tiny boxes on horizontal screens, so look at both dimensions
    const minDimension = Math.min(area.height, area.width);

    const boxAround = BOX_AROUND_VW_PERCENT * minDimension;

    const boxWidth = area.width - 2 * boxAround;
    //want the boxMargin to not be doubled up between boxes, so include an extra boxAround
    const boxHeight = ((area.height - boxAround) / boxCount) - boxAround;

    const boxPadding = boxWidth * BOX_PADDING_PERCENT;

    //DIAMETER
    //allowed amount includes ball margin
    const fromWidth = (boxWidth - (2 * boxPadding + BOX_BORDER_PX + BOX_BORDER_LEFT_PX)) / ballsPerRow;
    const fromHeight = (boxHeight - (2 * boxPadding + 2 * BOX_BORDER_PX)) / rowsPerBox;
    const slotSize = Math.min(fromHeight, fromWidth);
    const diameter = slotSize * ( 1 - 2 * BALL_MARGIN_PERCENT );

    console.log({diameter, slotSize, fromWidth, fromHeight});

    console.log("ran hook useSizes");

    return {
        boxPadding,
        diameter,
        slotSize,
    }
};

/**
 * let's say that screenWidth = 1 and express both screenHeight and padding as they relate to screenWidth
 */
export const boxAspectRatio = (screenAspectRatio: number, boxCount: number, paddingVw: number): number => {
    const boxWidth = 1 - 2 * paddingVw;
    const boxHeight = ( ( 1 / screenAspectRatio ) / boxCount ) - 2 * paddingVw;
    return boxWidth / boxHeight;
};

export const roughBoxRatio = (boxCount: number): number => boxAspectRatio(.51, boxCount, .05);
