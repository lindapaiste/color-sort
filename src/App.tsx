import React, {Component} from "react";
import {Level} from "./components/level/Level";
import {store} from "./state/level";
import {Provider} from "react-redux";

class App extends Component {
    render() {
        return (
            <Provider store={store}>
                <Level
                    count={10}
                    left={{r: 0, b: 255, g: 0}}
                    right={{r: 0, b: 0, g: 255}}
                />
            </Provider>
        );
    }
}

export default App;
