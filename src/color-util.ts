import { mapValues, range } from "lodash";

export interface Color {
  r: number;
  g: number;
  b: number;
}

export const colorString = (color: Color): string =>
  `rgb(${color.r}, ${color.g}, ${color.b})`;

/**
 * rgb values of the span between two colors.
 * will include negative values
 */
export const diffValues = (start: Color, end: Color): Color =>
  applyTransform((s, e) => e - s, start, end);
/*({
  r: end.r - start.r,
  g: end.g - start.g,
  b: end.b - start.b
});*/

export const applyTransform = (
  transform: (t: number, b: number) => number,
  target: Color,
  basis: Color
): Color => {
  return mapValues(target, (value: number, key: keyof Color) =>
    transform(value, basis[key])
  );
};

export const getIntermediates = (
  start: Color,
  end: Color,
  count: number
): Color[] => {
  const diff = diffValues(start, end);
  const indexes: number[] = range(1, count + 1);
  console.log(indexes);
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
  start: Color,
  end: Color,
  count: number
): Color[] => {
  return [start, ...getIntermediates(start, end, count - 2), end];
};
