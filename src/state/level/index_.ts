import {createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import {reducer, StateShape} from "./reducer";

export const configureStore = (initialState?: StateShape) => {

    //here is where to apply middleware, enhancers, etc.

    const enhancers = composeWithDevTools();

    return createStore(reducer, initialState, enhancers);
};