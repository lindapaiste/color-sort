import { Color, getGradient } from "./color-util";
import { Props } from "./Level";
import { useState } from "react";
import { shuffle, fromPairs } from "lodash";

/**
 * for first go, not using position at all
 * just what loaction it is in
 */

export enum LOCATIONS {
  LEFT,
  RIGHT,
  UNASSIGNED
}

/**
 * changeable properties
 */
export interface BallState {
  location: LOCATIONS;
}
/**
 * the immutable properties
 */
export interface BallData {
  //id: number,
  color: Color;
  correctLocation: LOCATIONS;
}

export interface BallProps {
  id: number;
  color: Color;
  move(l: LOCATIONS): void;
}

export const generateBallData = ({ count, left, right }: Props): BallData[] => {
  /**
   * assuming that count from props is the count of balls on EACH side,
   * so multiply times 2
   */
  const colors = getGradient(left, right, 2 * count);

  const data = colors.map((color, i) => ({
    //id: i,
    color,
    correctLocation: i < count ? LOCATIONS.LEFT : LOCATIONS.RIGHT
  }));

  return shuffle(data);
};

export const useLevelState = (props: Props): LevelStateReturns => {
  const ballData = generateBallData(props);

  //TODO: useEffect to reset on level change

  const initialBallState = (): BallState => ({
    location: LOCATIONS.UNASSIGNED
  });

  const [locState, setLocState] = useState<BallState[]>(
    ballData.map(initialBallState)
  );

  const moveBall = (id: number) => (location: LOCATIONS) =>
    setLocState({
      ...locState,
      [id]: {
        ...locState[id],
        location
      }
    });

  const countWrong: number = ballData.filter(
    (ball, id) => ball.correctLocation !== locState[id].location
  ).length;

  const isWin: boolean = countWrong === 0;

  const getLocIds = (location: LOCATIONS): number[] => {
    return [...ballData.keys()].filter(
      id => locState[id].location === location
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

export interface LevelStateReturns {
  isWin: boolean,
  countWrong: number,
  getLocBalls( l: LOCATIONS): BallProps[],
}