import React, { Component } from "react";
import { View } from "react-native";
import { Level } from "./Level";

class App extends Component {
  render() {
    return (
      <Level
        count={10}
        left={{ r: 0, b: 255, g: 0 }}
        right={{ r: 0, b: 0, g: 255 }}
      />
    );
  }
}

export default App;
