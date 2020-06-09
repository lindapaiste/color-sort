import {Props} from "../components/level/Level";
import {BallData, LOCATIONS} from "../state/level/types";
import {getGradient} from "./color-util";
import {shuffle} from "lodash";
/**
 * for first go, not using position at all
 * just what location it is in
 */

export const generateLevelBalls = ({count, left, right}: Props): BallData[] => {
    /**
     * assuming that count from props is the count of balls on EACH side,
     * so multiply times 2
     */
    const colors = getGradient(left, right, 2 * count);

    const data = colors.map((color, i) => ({
        id: i,
        color,
        correctLocation: i < count ? LOCATIONS.LEFT : LOCATIONS.RIGHT,
        initialLocation: LOCATIONS.UNASSIGNED,
    }));

    return shuffle(data);
};
