import { createContext, useContext } from "react";

const MovingBallContext = createContext<number | undefined>();

export const useMovingBall = (): number | undefined => {
  return useContext(MovingBallContext);
};
