/**
 * all the functions in the files clone the array -- does not mutate
 */

/**
 * replace the element at position i with the given value
 */
export const replaceIndex = <T>(array: T[], i: number, value: T): T[] => {
    /*const clone = [...array];
    clone[i] = value;
    return clone;*/
    return Object.assign([...array], {[i]: value});
};

/**
 * switch the elements at the given positions
 */
export const swapIndexes = <T>(array: T[], i: number, j: number): T[] => {
    return Object.assign([...array], {
        [i]: array[j],
        [j]: array[i],
    });
};


/**
 * takes the element at the given index out of the array
 *
 * has side effects:
 * reduces the array length from n to n-1
 * changes the indexes of values past i
 */
export const removeIndex = <T>(array: T[], i: number): T[] => {
    return [...array.slice(0, i), ...array.slice(i + 1)]
};

/**
 * inserts the provided element at the given position
 *
 * has side effects:
 * increases the array length from n to n+1
 * changes the indexes of values past i
 */
export const insertIndex = <T>(array: T[], i: number, value: T): T[] => {
    return [...array.slice(0, i), value, ...array.slice(i)]
};

/**
 * adds the provided value at the ends of the array
 *
 * this is better than concat when the appended value is an array
 * because it will not flatten it
 *
 * alters length, but not indexes
 */
export const appendValue = <T>(array: T[], value: T): T[] => {
    return [...array, value];
};

/**
 * removes an element from the array by value rather than index
 * assumes the value only occurs once
 *
 * alters length and indexes
 */
export const removeValue = <T>(array: T[], value: T): T[] => {
    const i = array.indexOf( value );
    return i === -1 ? array : removeIndex( array, i );
};

/**
 * will append the value only if not already in the array
 *
 * alters length, but not indexes
 */
export const includeValue = <T>(array: T[], value: T): T[] => {
    if ( array.includes( value ) ) {
        return array;
    } else return appendValue( array, value );
};

/**
 * will append the value if it is not in the array,
 * or remove the value if it is in the array already
 *
 * alters length and indexes
 */
export const toggleInclusion = <T>(array: T[], value: T): T[] => {
    if ( array.includes( value ) ) {
        return removeValue(array, value);
    } else {
        return appendValue( array, value );
    }
};
