import {generateBoxBalls, Levers} from "../util/generateBoxBalls";
import {BoxLevel, BoxLevelProps} from "../components/game/BoxLevel2";
import {colorString, createRandom, distance, RGB} from "../util/color-util";
import {range} from "lodash";
import {I_PackPlay} from "./types";

export const BOX_LEVERS: Levers = {
    noise: 100,
    maxDistance: .2,
    minDistance: 0,
    maxDistinctness: .5,
    minDistinctness: .1,
};

export interface VariableProps {
    ballsPerRow: number;
    rowsPerBox: number;
    levers: Levers;
    boxCount: number;
}

const STANDARD_PROPS: VariableProps = {
    ballsPerRow: 5,
    rowsPerBox: 2,
    boxCount: 4,
    levers: BOX_LEVERS,
}

export const randomLevelProps = ({boxCount, levers, ballsPerRow, rowsPerBox}: VariableProps = STANDARD_PROPS): BoxLevelProps => {
    const colors = randomInputColors(boxCount, levers);
    const balls = generateBoxBalls(colors, rowsPerBox * ballsPerRow, levers);
    const boxes = colors.map( rgb => ({color: colorString(rgb)}));
    return {
        ballsPerRow,
        rowsPerBox,
        balls,
        boxes,
    }
};

export const INFINITE_BOX: I_PackPlay<BoxLevelProps> = {
    Render: BoxLevel,
    getLevelProps: () => randomLevelProps(),
    hasNextLevel: () => true,
    nextLevelProps: () => randomLevelProps(),
    getStats: (props) => ({fewestMoves: 0}) //TODO - is getting the input colors, not the balls
};

export const randomInputColors = ( count: number, levers: Levers = BOX_LEVERS ): RGB[] => {
    const colors = [createRandom()];
    while ( colors.length < count ) {
        const created = createRandom();
        //block black
        if ( distance([0,0,0])(created) < .2 ) {
            continue;
        }
        /*
        colors must have distance from each other greater than the minDistinctness
        or else there are 0 possible balls that match distance and distinctness constraints
        multiplier is arbitrary
         */
        const distances = colors.map( distance(created) );
        if ( distances.some( d => d < levers.minDistinctness * 2.5 ) ) {
            continue;
        }
        colors.push(created);
    }
    return range(0, count).map(createRandom);
    //TODO: must make sure the colors are different enough for ball generation not to choke
};


/*
investigate botch sets: rgb(239, 207, 219); rgb(122, 186, 241); rgb(124, 135, 158); rgb(241, 230, 189);
has a distance of 0.08570818283809416 and another of 0.22060929456482936 so how did it pass?
 */
