import {I_Slot} from "../../state/scale/types";
import {__useLevelSelector} from "../../state";
import {getZoneRectangle} from "../../state/scale/selectors";
import {BoxSizes, LayoutSettings} from "../boxes/calcSizing";
import {LayoutRectangle} from "react-native";
import {useLayout} from "../boxes/LayoutRedux";
import {XY} from "../level-touch/types";

export const getCenter = ( rectangle: LayoutRectangle ): XY => {
  return {
      x: rectangle.x + .5 * rectangle.width,
      y: rectangle.y + .5 * rectangle.height,
  }
};

//sloppy -- will refactor later -- but need to get this info from somewhere
type CalcRequiresProps = I_Slot & Pick<BoxSizes, 'boxPadding' | 'slotSize'> & Pick<LayoutSettings, 'ballsPerRow'>

export const useSlotRectangle = ({location, position}: I_Slot): LayoutRectangle | undefined => {
    const zone = __useLevelSelector(getZoneRectangle(location));
    const layout = useLayout();
    if ( zone === undefined || layout === undefined ) {
        return undefined;
    }
    const {ballsPerRow, boxPadding, slotSize} = layout;
    const columnIndex = position % ballsPerRow;
    const rowIndex = Math.floor( position / ballsPerRow );
    return {
        x: zone.x + boxPadding + rowIndex * slotSize,
        y: zone.y + boxPadding + columnIndex * slotSize,
        width: slotSize,
        height: slotSize,
    }
};

export const useSlotCenter = (props: I_Slot): XY | undefined => {
    const rect = useSlotRectangle(props);
    return rect ? getCenter(rect) : undefined;
};
