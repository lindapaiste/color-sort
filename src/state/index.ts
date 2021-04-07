import {configureStore, combineReducers} from "@reduxjs/toolkit";
import {reducer as level, StateShape as LevelShape} from "./level/reducer";
import {reducer as user, StateShape as UserShape} from "./user/reducer";
import {reducer as slotSwap, StateShape as SlotSwapShape} from "./slotSwap/reducer";
import {useSelector} from "react-redux";

export const useUserSelector = <T>(selector: (subState: UserShape) => T): T => {
    return useSelector<RootState, T>(state => selector(state.user));
};

export const useLevelSelector = <T>(selector: (subState: LevelShape) => T): T => {
    return useSelector<RootState, T>(state => selector(state.level));
};

export const useBoxSwapLevelSelector = <T>(selector: (subState: SlotSwapShape) => T): T => {
    return useSelector<RootState, T>(state => selector(state.slotSwap));
};

interface RootState {
    user: UserShape,
    level: LevelShape,
    slotSwap: SlotSwapShape,
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
import {reducer, StateShape} from "./reducer";

export const configureStore = (initialState?: StateShape) => {

    //here is where to apply middleware, enhancers, etc.

    const enhancers = composeWithDevTools();

    return createStore(reducer, initialState, enhancers);
};*/
