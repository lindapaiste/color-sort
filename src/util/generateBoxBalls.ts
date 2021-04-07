import {BallData as BallData_Old} from "../state/level/types";
import {addNoise, colorString, distance, RGB} from "./color-util";
import {flatMap, isEqual, shuffle} from "lodash";
import {BallData as BallData_New} from "../state/slotSwap/types";

interface Evaluation {
    match: RGB,
    distance: number,
    distinctness: number,
}

const evaluateMatch = (color: RGB, choices: RGB[]): Evaluation => {

    const distances = choices.map(distance(color)); //has same indexes

    const sortedDistances = [...distances].sort();

    const matchDistance = sortedDistances[0];  //Math.min(...distances);

    const nextDistance = sortedDistances[1]; //Math.min(...without(distances, minDistance) /*will fuck up if multiple
                                             // of the same number*/)

    const distinctness = nextDistance - matchDistance;

    const match = choices[distances.indexOf(matchDistance)];

    return {
        match,
        distance: matchDistance,
        distinctness,
    };

};

enum BallGenErrorType {
    WRONG_MATCH,
    MAX_DISTANCE,
    MIN_DISTANCE,
    MAX_DISTINCTNESS,
    MIN_DISTINCTNESS,
}

interface BallGenError_Raw {
    type: BallGenErrorType;
    message: string;
}

interface BallGenError_Data {
    color: RGB;
    boxColor: RGB;
    choices: RGB[];
    levers: Levers;
    evaluation: Evaluation;
}

class BallGenError extends Error {
    type: BallGenErrorType;
    data: BallGenError_Data;

    constructor({type, message, data}: BallGenError_Raw & {data: BallGenError_Data}) {
        super(message);
        this.type = type;
        this.data = data;
    }

}

const getError = (evaluation: Evaluation, levers: Omit<Levers, 'noise'>, expected: RGB): BallGenError_Raw | false => {

    const {match, distance, distinctness} = evaluation;

    const {minDistance, maxDistance, minDistinctness, maxDistinctness} = levers;

    if (!isEqual(match, expected)) {
        return ({
            type: BallGenErrorType.WRONG_MATCH,
            message: `wrong match: closer to ${colorString(match)} than to ${colorString(expected)}`
        });
    } else if (distance > maxDistance) {
        return ({
            type: BallGenErrorType.MAX_DISTANCE,
            message: `not close enough to color: distance ${distance} exceeds allowed amount ${maxDistance}`
        });
    } else if (distance < minDistance) {
        return ({
            type: BallGenErrorType.MIN_DISTANCE,
            message: `too close to color: distance ${distance} must be at least ${minDistance}`
        });
    } else if (distinctness > maxDistinctness) {
        return ({
            type: BallGenErrorType.MAX_DISTINCTNESS,
            message: `too obvious: distinctness amount ${distinctness} exceeds allowed ${maxDistinctness}`
        });
    } else if (distinctness < minDistinctness) {
        return ({
            type: BallGenErrorType.MIN_DISTINCTNESS,
            message: `too ambiguous: distinctness ${distinctness} must be at least ${minDistinctness}`
        });
    } else return false;
};

export interface Levers {
    noise: number,
    minDistance: number,
    maxDistance: number,
    minDistinctness: number,
    maxDistinctness: number,
}

export const generateBoxBallsOld = (colors: RGB[], countPer: number, levers: Levers): BallData_Old[] => {
    const balls = _generateBoxBallsBase(colors, countPer, levers);
    return balls.map(ball => ({
            ...ball,
            initialLocation: Math.floor(ball.initialSlot / countPer),
            correctLocation: ball.correctBox,
        })
    )
};

export const generateBoxBalls = (colors: RGB[], countPer: number, levers: Levers): BallData_New[] => {
    const balls = _generateBoxBallsBase(colors, countPer, levers);
    return balls.map(ball => ({
            ...ball,
            color: colorString(ball.color),
        })
    )
};

// return a color or throw an Error
const createBallForBox = (boxColor: RGB, choices: RGB[], levers: Levers): RGB => {
    const noisy = addNoise(levers.noise)(boxColor);

    // must ensure that the noisy value is still closest to this box vs other boxes
    // also want to make sure that this distinction is obvious - ie. it is much closer
    const evaluation = evaluateMatch(noisy, choices);

    const error = getError(evaluation, levers, boxColor);
    if (error !== false) {
        throw new BallGenError({...error, data: {boxColor, choices, color: noisy, evaluation, levers}});
    }

    return noisy;
}

const _generateBoxBallsBase = (colors: RGB[], countPer: number, levers: Levers): Array<Omit<BallData_New, 'color'> & { color: RGB }> => {

    const noisyBoxColors = (color: RGB): RGB[] => {
        const array: RGB[] = [];

        // use i to prevent infinite loops due to contradictory parameters
        let i = 0;
        while (array.length < countPer && i < 1000) {
            try {
                const ball = createBallForBox(color, colors, levers);
                array.push(ball);
            } catch (e) {
                // console.log(e.message);
            }
            // increment whether success or failure
            i++;
        }
        return array;
    };

    /**
     * first map doesn't have initial location.
     * then shuffle then and assign initial location based on position in the shuffled array
     */
    const data = flatMap(colors, (boxColor, iBox) =>
        noisyBoxColors(boxColor).map((ballColor, iBall) => ({
            color: ballColor,
            correctBox: iBox,
            id: iBall + countPer * iBox,
        }))
    );

    const shuffled = shuffle(data);

    return shuffled.map((ball, i) => ({
        ...ball,
        initialSlot: i,
    }))

};
