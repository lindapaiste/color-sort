import {useDispatch} from "react-redux";
import {__useLevelSelector} from "../../state";
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
    const balls = __useLevelSelector(getAllBalls);

    const id = __useLevelSelector(state => state.stats.levelId);
    const dispatch = useDispatch();

    return () => {
        dispatch(setLevel(balls, id));
    }
};
