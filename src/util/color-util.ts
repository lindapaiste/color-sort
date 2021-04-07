import {mapValues, range, random} from "lodash";
import {Props as LevelProps} from "../components/game/ScaleLevel";

export type RGB = [number, number, number];

/**
 * declaring this as a constant rather than using Object.keys() because
 * an object which fits typescript definition of Color could actually have other additional properties
 */

export const colorString = ([r,g,b]: RGB): string =>
    `rgb(${r}, ${g}, ${b})`;

export const alphaColorString = ([r,g,b]: RGB, alpha: number = 1): string =>
    `rgba(${r}, ${g}, ${b}, ${alpha})`;

/**
 * rgb values of the span between two colors.
 * will include negative values
 */
export const diffValues = (start: RGB, end: RGB): RGB =>
    applyTransform((s, e) => e - s, start, end);
/*({
  r: end.r - start.r,
  g: end.g - start.g,
  b: end.b - start.b
});*/

export function applyTransform (
    transform: (t: number, b: number) => number,
    target: RGB,
    basis: RGB
): RGB;
export function applyTransform (
    transform: (t: number) => number,
    target: RGB,
): RGB;
export function applyTransform (
    transform: (t: number, b: number) => number,
    target: RGB,
    basis?: RGB
): RGB {
    return target.map(
        (value, i) => {
            if (basis === undefined) {
                return transform(value, 0);
            } else {
                return transform(value, basis[i]);
            }
        }
    ) as RGB;
}

export const getIntermediates = (
    start: RGB,
    end: RGB,
    count: number
): RGB[] => {
    const diff = diffValues(start, end);
    const indexes: number[] = range(1, count + 1);
    return indexes.map(i =>
        applyTransform(
            (start, diff) => start + (i * diff) / (count + 1),
            start,
            diff
        )
    );
};

/**
 * range includes left and right, as does count
 */
export const getGradient = (
    start: RGB,
    end: RGB,
    count: number
): RGB[] => {
    return [start, ...getIntermediates(start, end, count - 2), end];
};


/**
 * mathematical difference in the 3D cube is from 0 to sqrt 3,
 * but this is adjusted to range from 0 to 1
 */
export const distance = (a: RGB) => (b: RGB): number => {
    const squaredSum = a.reduce( (acc, curr, i) => acc + Math.pow( ( b[i] - curr ), 2), 0);
    return Math.sqrt(squaredSum) / ( 255 * Math.sqrt(3) );
};

export const getMedian = (start: RGB, end: RGB): RGB =>
    getIntermediates(start, end, 1)[0];


export const constrainValue = (raw: number ): number => {
    const value = Math.round(raw);
    if ( value > 255 ) return 255;
    if ( value < 0 ) return 0;
    return value;
};


/**
 * ////normalized such that max is a value from 0 to 1 rather than from 0 to 255
 * roughly a percent of each vector
 */
export const addNoise = (max: number) => (color: RGB): RGB => {
    return applyTransform(
        (initial: number) => {
            const noise = random( -max,max );  //an integer between negative and positive of max, ie. -10 to +10
            //console.log({noise, initial});
            return constrainValue( initial + noise );  //add noise to all three vectors, but make sure that it remains a valid RGB
        }
        , color);
};

export const createRandom = (): RGB => {
    return [random(0, 255), random(0, 255), random(0,255)];
};
