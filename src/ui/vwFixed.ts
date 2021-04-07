import {Dimensions} from "react-native";

/**
 * is it safe to assume that screen/window size never changes?
 * could change when running android on chromebook, for example, and going from vertical to full screen
 * but these are edge cases
 * there should be a resize event that I can listen for
 * can make use of useMemo
 */

export const WIDTH = Dimensions.get("window").width;

export const HEIGHT = Dimensions.get("window").height;

export const vw = (percent: number): number => percent * WIDTH / 100;

export const vh = (percent: number): number => percent * HEIGHT / 100;
