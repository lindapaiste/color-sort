import {Props} from "../components/Level";
import {useState} from "react";
import {BallProps, BallState, LevelStateReturns, LOCATIONS} from "./level/types";
import {generateLevelBalls} from "../util/generateLevelBalls";

export const useLevelState = (props: Props): LevelStateReturns => {
    const ballData = generateLevelBalls(props);

    //TODO: useEffect to reset on level change

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

    const getBallProps = (id: number): BallProps => ({
        id,
        color: ballData[id].color,
        move: moveBall(id)
    });

    const getLocBalls = (location: LOCATIONS): BallProps[] => {
        return getLocIds(location).map(getBallProps);
    };

    return {
        isWin,
        countWrong,
        getLocBalls
    };
};

