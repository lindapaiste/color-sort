import {RGB} from "../util/color-util";
import {Props as ScaleLevelProps, ScaleLevel} from "../components/game/ScaleLevel";
import {_BoxLevel, _BoxLevelProps} from "../components/game/BoxLevel";
import {DefinedPack} from "./types";

const left: RGB = [0, 255, 0];
const right: RGB = [0, 0, 255];

export const SCALE_LEVELS: ScaleLevelProps[] = [
    {left, right, count: 4},
    {left, right: [0, 255, 200], count: 10},
    {left, right, count: 10},
    {left, right, count: 20},
];

export const getLevel = (id: number): ScaleLevelProps => SCALE_LEVELS[id];


/**
 * 0 vs 1 indexing of levels makes things weird.  Should probably use 0-indexed id internally, and then add 1 when displaying the scales number
 */

export const SCALE_PACK: DefinedPack<ScaleLevelProps> = {
    Render: ScaleLevel,
    levels: SCALE_LEVELS,
};

export const BOX_PACK: DefinedPack<_BoxLevelProps> = {
    Render: _BoxLevel,
    levels: [
        {
            colors: [
                [213, 150, 214],
                [193, 40, 90],
                [112, 75, 219],
                [234, 138, 92],
            ],
            ballsPerRow: 5,
            rowsPerBox: 2,
            levers: {
                noise: 100,
                maxDistance: .3,
                minDistance: 0,
                maxDistinctness: .5,
                minDistinctness: .1,
            }
        }
    ],
};

