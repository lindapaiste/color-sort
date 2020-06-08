import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { reducer } from "./reducer";
export var configureStore = function (initialState) {
    //here is where to apply middleware, enhancers, etc.
    var enhancers = composeWithDevTools();
    return createStore(reducer, initialState, enhancers);
};
//# sourceMappingURL=index_.js.map