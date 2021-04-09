import {Props} from "../components/game/ScaleLevel";
import {useState} from "react";
import {BallState, LOCATIONS} from "./scale/types";
import {generateScaleBalls} from "../util/generateScaleBalls";
import {RGB} from "../util/color-util";

export interface __BallProps {
    id: number;
    color: RGB;

    move(l: LOCATIONS): void;
}

export interface LevelStateReturns {
    isWin: boolean;
    countWrong: number;

    getLocBalls(l: LOCATIONS): __BallProps[];
}

export const useLevelState = (props: Props): LevelStateReturns => {
    const ballData = generateScaleBalls(props);

    //TODO: useEffect to reset on scales change

    const initialBallState = (): BallState => ({
        currentLocation: LOCATIONS.UNASSIGNED
    });

    const [locState, setLocState] = useState<BallState[]>(
        ballData.map(initialBallState)
    );

    const moveBall = (id: number) => (location: LOCATIONS) =>
        setLocState({
            ...locState,
            [id]: {
                ...locState[id],
                currentLocation: location
            }
        });

    const countWrong: number = ballData.filter(
        (ball, id) => ball.correctLocation !== locState[id].currentLocation
    ).length;

    const isWin: boolean = countWrong === 0;

    const getLocIds = (location: LOCATIONS): number[] => {
        return [...ballData.keys()].filter(
            id => locState[id].currentLocation === location
        );
    };

    const getBallProps = (id: number): __BallProps => ({
        id,
        color: ballData[id].color,
        move: moveBall(id)
    });

    const getLocBalls = (location: LOCATIONS): __BallProps[] => {
        return getLocIds(location).map(getBallProps);
    };

    return {
        isWin,
        countWrong,
        getLocBalls
    };
};

