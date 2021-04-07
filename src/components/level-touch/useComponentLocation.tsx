import {MutableRefObject, useRef, useState} from "react";
import {View} from "react-native";
import {PageLocation} from "./types";

export interface Return {
    ref: MutableRefObject<View | null>;
    onLayout(): void;
    location: PageLocation | undefined;
}

/**
 * hook returns a ref and an onLayout function which must both be passed to the view
 * also returns the value of Location
 */
export const useComponentLocation = (): Return => {
    const ref = useRef<View>(null);

    const [location, setLocation] = useState<PageLocation | undefined>(undefined);

    const onLayout = () => {
        ref.current?.measure(
            (x, y, width, height, pageX, pageY) => {
                setLocation({
                    pageX,
                    pageY
                });
            });
    };

    return {
        ref,
        onLayout,
        location,
    }
};
