import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {reducer as level, StateShape as LevelShape} from "./scale/reducer";
import {reducer as user} from "./user/reducer";
import {reducer as slotSwap} from "./slotSwap/reducer";
import {useSelector} from "react-redux";
import {UserState} from "./user/types";
import {BoxSwapState} from "./slotSwap/types";

export const useUserSelector = <T>(selector: (subState: UserState) => T): T => {
    return useSelector<RootState, T>(state => selector(state.user));
};

export const useLevelSelector = <T>(selector: (subState: LevelShape) => T): T => {
    return useSelector<RootState, T>(state => selector(state.level));
};

export const useBoxSwapLevelSelector = <T>(selector: (subState: BoxSwapState) => T): T => {
    return useSelector<RootState, T>(state => selector(state.slotSwap));
};

interface RootState {
    user: UserState,
    level: LevelShape,
    slotSwap: BoxSwapState,
}

const reducer = combineReducers({
    user,
    level,
    slotSwap,
});

export const store = configureStore({
    reducer,
});

/*import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {reducer, State} from "./reducer";

export const configureStore = (initialState?: State) => {

    //here is where to apply middleware, enhancers, etc.

    const enhancers = composeWithDevTools();

    return createStore(reducer, initialState, enhancers);
};*/
