import {configureStore} from "@reduxjs/toolkit";
import {reducer as level, StateShape as LevelShape} from "./scale/reducer";
import {reducer as user} from "./user/reducer";
import {reducer as slotSwap} from "./slotSwap/reducer";
import {useSelector as _useSelector, createSelectorHook} from "react-redux";

export const __useLevelSelector = <T>(selector: (subState: LevelShape) => T): T => {
    return _useSelector<RootState, T>(state => selector(state.scale));
};

/*
interface RootState {
    user: UserState,
    level: LevelShape,
    slotSwap: BoxSwapState,
}*/


export const useSelector = createSelectorHook<RootState>();

export const store = configureStore({
    reducer: {
        user,
        scale: level,
        slotSwap,
    }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

/*import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {reducer, State} from "./reducer";

export const configureStore = (initialState?: State) => {

    //here is where to apply middleware, enhancers, etc.

    const enhancers = composeWithDevTools();

    return createStore(reducer, initialState, enhancers);
};*/
