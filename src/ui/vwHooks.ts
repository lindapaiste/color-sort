import {useState, useEffect} from "react";
import {Dimensions, ScaledSize} from "react-native";

/**
 * https://www.reactnativeschool.com/building-a-dimensions-hook-in-react-native
 */
export const useDimensions = (): ScaledSize => {
    const [size, setSize] = useState(Dimensions.get('window'));

    useEffect(() => {
        const onChange = (e: { screen: ScaledSize; window: ScaledSize }) => {
            setSize(e.window);
        };

        Dimensions.addEventListener('change', onChange);

        return () => Dimensions.removeEventListener('change', onChange);
    });

    return {
        ...size,
        //isLandscape: size.width > size.height,
    };
};

/**
 * takes in the desired vw percent and returns the pixels, ie. if width = 360, 5 => 18
 */
export const useVw = (percent: number): number => {
  const {width} = useDimensions();
  return percent * width / 100;
};

export const useVh = (percent: number): number => {
    const {height} = useDimensions();
    return percent * height / 100;
};
