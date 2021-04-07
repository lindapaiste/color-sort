import {LOCATIONS} from "../state/level/types";
import {findIndex} from "lodash";

interface FromToCount {
    from: LOCATIONS;
    to: LOCATIONS;
    count: number;
}

export const swapMinimumMoves = (balls: Array<{correctLocation: LOCATIONS, initialLocation: LOCATIONS}>): number => {

    //this won't be the absolute minimum because I don't know how to properly count complex swaps

    //every time we need to do a swap, the inverse of that swap happens automatically and so is already included in move count
    const freeMoves: FromToCount[] = [];

    let moveCount = 0;

    balls.forEach( ({correctLocation: to, initialLocation: from}) => {
        //if using a free move, subtract from available count
        const i = findIndex(freeMoves, {from, to});
        if ( i && freeMoves[i].count > 0 ) {
            freeMoves[i].count -= 1;
        }
        //otherwise do the move and add the inverse as free
        else {
            moveCount++;
            freeMoves.push( {from: to, to: from, count: 1});
        }
    });

    return moveCount;
};

export const swapMinimumMoves_ = (balls: Array<{correctLocation: LOCATIONS, initialLocation: LOCATIONS}>): number => {

    //this won't be the absolute minimum because I don't know how to properly count complex swaps

    const neededMoves: FromToCount[] = [];

    balls.forEach( ({correctLocation: to, initialLocation: from}) => {
        const i = findIndex(neededMoves, {from, to});
        if ( i ) {
            neededMoves[i].count += 1;
        } else {
            neededMoves.push( {from, to, count: 1});
        }
    });

    let moveCount = 0;

    //count reversible pairs, ie.  balls from 1 needing to be in 2 and balls from 2 needing to be in 1
    neededMoves.forEach(({from, to, count}, index) => {
        const inverseIndex = findIndex(neededMoves,{to: from, from: to});
        //will be counting paired entries twice, so for now count unpaired entries twice too so that I can divide by 2 in the end
        const inverseCount = inverseIndex ? neededMoves[inverseIndex].count : 0;
        moveCount += inverseIndex ? Math.max(count, inverseCount) : 2 * count;
    });

  return moveCount / 2;

};
