import { createContext, useContext } from "react";
var MovingBallContext = createContext(undefined);
export var useMovingBall = function () {
    return useContext(MovingBallContext);
};
//# sourceMappingURL=ball-move-context.js.map