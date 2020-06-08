import { LOCATIONS } from "../state/level/types";
import { getGradient } from "./color-util";
import { shuffle } from "lodash";
/**
 * for first go, not using position at all
 * just what location it is in
 */
export var generateLevelBalls = function (_a) {
    var count = _a.count, left = _a.left, right = _a.right;
    /**
     * assuming that count from props is the count of balls on EACH side,
     * so multiply times 2
     */
    var colors = getGradient(left, right, 2 * count);
    var data = colors.map(function (color, i) { return ({
        id: i,
        color: color,
        correctLocation: i < count ? LOCATIONS.LEFT : LOCATIONS.RIGHT,
        initialLocation: LOCATIONS.UNASSIGNED,
    }); });
    return shuffle(data);
};
//# sourceMappingURL=generateLevelBalls.js.map