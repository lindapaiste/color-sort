import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
    centerContents: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    screen: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "black"
    },
    menu: {
        width: "100%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
    },
    modal: {
        backgroundColor: "black",
        padding: 10,
    },
    playArea: {
        flex: 1,
        width: "100%",
    },
    playFill: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
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
        justifyContent: "space-evenly",
        alignItems: "flex-end"
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
    },
    ballPile: {
        display: "flex",
        flexDirection: "row-reverse",
        flexWrap: "wrap-reverse",
        justifyContent: "center",
        alignItems: "flex-end",
        alignContent: "flex-end"
    },
    whiteText: {
        color: "white",
    },
    boxBorder: {
        borderWidth: 1,
        borderLeftWidth: 10,
        elevation: 5,
    },
    testMode: {
        backgroundColor: "#460505",
        borderColor: "red",
        borderWidth: 1,
    }
});
