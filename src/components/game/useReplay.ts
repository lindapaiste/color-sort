import {useDispatch} from "react-redux";
import {useLevelSelector} from "../../state";
import {getAllBalls} from "../../state/scale/selectors";
import {setLevel} from "../../state/scale/actions";

/**
 * as currently designed, replay involves both selector and dispatch actions
 *
 * balls will be in the same boxes/locations but not necessarily the same order
 *
 * relies on initialLocation stored in redux
 *
 * hook returns a function -- doesn't call automatically
 */
export const useReplay = (): () => void => {
    const balls = useLevelSelector(getAllBalls);

    const id = useLevelSelector(state => state.stats.levelId);
    const dispatch = useDispatch();

    return () => {
        dispatch(setLevel(balls, id));
    }
};
