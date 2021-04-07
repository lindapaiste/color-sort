import {BallData, BoxData} from "../../state/slotSwap/types";
import {View} from "react-native";
import React from "react";
import {BOX_LEVERS, randomInputColors, randomLevelProps} from "../../data/infiniteBoxProps";
import {random} from "lodash";
import {generateBoxBalls} from "../../util/generateBoxBalls";
import {styles} from "../../ui/styles";
import {colorString} from "../../util/color-util";
import {BALL_MARGIN_PERCENT, BOX_PADDING_PERCENT, calcSizing} from "./calcSizing";
import {MakeRows} from "./MakeRows";
import {RBasicBall} from "../level-touch/BasicBall";
import {useDimensions} from "../../ui/vwHooks";

export interface Props {
    boxes: Array<{
        color: string,
        ballColors: string[],
    }>;
    slotSize: number;
    ballsPerRow: number;
    diameter: number;
    boxPadding: number | string;
}
//const diameter = slotSize * ( 1 - 2 * BALL_MARGIN_PERCENT );

export const Preview = ({boxes, slotSize, ballsPerRow, diameter, boxPadding}: Props) => {

    return (
        <View
            style={{
                flex: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-evenly",
                alignItems: "center",
            }}
        >
            {boxes.map( ({color, ballColors}, index) =>
                <View
                    key={color}
                    style={[
                        styles.boxBorder,
                        {
                            borderColor: color,
                            padding: boxPadding,
                        }
                    ]}>
                    <MakeRows
                        balls={ballColors.map(
                            (color, id) => ({color, id, slotSize, diameter})
                        )}
                        RenderBall={RBasicBall}
                        ballsPerRow={ballsPerRow}
                    />
                </View>
            )}


        </View>
    )
};

export const GeneratePreview = () => {
    const boxCount = random(1, 6);
    const ballsPerRow = random(3, 10);
    const rowsPerBox = random(1, 5);
    const colors = randomInputColors(boxCount, BOX_LEVERS);

    /**
     * note: is stupid to shuffle and then sort but whatever
     * fixing would require making changes to generateBoxBalls
     */
    const balls = generateBoxBalls(colors, ballsPerRow * rowsPerBox, BOX_LEVERS);
    const boxes = colors.map((rgb, index) => ({
        color: colorString(rgb),
        ballColors: balls.filter(ball => ball.correctBox === index).map(ball => ball.color ),
    }));

    const area = useDimensions();
    const {slotSize, diameter, boxPadding} = calcSizing({area, ballsPerRow, rowsPerBox, boxCount});

    return (
        <Preview
            boxes={boxes}
            slotSize={slotSize}
            ballsPerRow={ballsPerRow}
            diameter={diameter}
            boxPadding={boxPadding}
        />
    )

};
