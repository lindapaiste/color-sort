import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  screen: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    width: "100%",
    height: "100%",
    backgroundColor: "black"
  },
  unassignedSection: {
    flexBasis: "40%",
    flex: 1
  },
  scalesSection: {
    flexBasis: "60%",
    flex: 1,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly"
  },
  scaleSide: {
    padding: 10,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  scaleBase: {
    width: "100%",
    height: 20,
    textAlign: "center"
  },
  ballPile: {
    display: "flex",
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "flex-end",
    alignContent: "flex-end"
  },
  ball: {
    //@ts-ignore
    borderRadius: "50%",
    margin: 3
  }
});
