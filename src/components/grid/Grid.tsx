import React from "react";
import {useUserSelector} from "../../state";
import {getCompletedLevels, levelBest} from "../../state/user/selectors";
import {FlatList, View} from "react-native";
import {Props as ThumbProps, Thumb} from "./Thumb";
import {getLevel} from "../../data/levels";
import {colorString, createRandom, getMedian} from "../../util/color-util";
import {range, clamp} from "lodash";
import {useDimensions} from "../../ui/vwHooks";
import {LevelVictories} from "../../state/user/types";
import {styles} from "../../ui/styles";


//TEMPORARY FIX
//TODO: get actual level data



/**
 * getting FlatList to render in a grid is stupidly annoying.  has prop numColumns but it messes with flexbox
 * so need to handle infinite scrolling myself
 */

const MAX_THUMB_SIZE = 200;
const MIN_THUMB_SIZE = 40;
const BASE_PER_ROW = 5;

/**
 * do around 6 per row, but clamp to a minimum and maximum size
 * if clamped, need to adjust to fill the space
 */
const calcNumColumns = (width: number): number => {
    if ( width < BASE_PER_ROW * MIN_THUMB_SIZE ) {
        return Math.floor( width / MIN_THUMB_SIZE );
    } else if ( width > BASE_PER_ROW * MAX_THUMB_SIZE ) {
        return Math.ceil( width / MAX_THUMB_SIZE );
    } else return BASE_PER_ROW;
};

interface RenderGridProps {
    width: number;
    count: number;
    getThumbProps(id: number): Omit<ThumbProps, 'size' | 'number'>;
}

/**
 * note: MUST change key prop on FlatList if changing numColumns, else screen goes white
 */
export const RenderGrid = ({width, count, getThumbProps}: RenderGridProps) => {
    const ids = range(count);

    console.log({ids});

    const numColumns = calcNumColumns(width);

    const size = width / numColumns;

    return (
        <FlatList
            key={numColumns}
            data={ids}
            keyExtractor={(id) => String(id)}
            renderItem={({item: id}) => {
                const props = getThumbProps(id);
                return (
                <Thumb
                    {...props}
                    number={id + 1}
                    size={size}
                />
            )
            }}
            style={{
            }}
            numColumns={numColumns}
        />
    )
};

//    const rawData = useUserSelector(state => state.levelData );

export interface LevelFixedData {
    thumbColor: string;
    minimumMoves: number;
    //in the future, some sort of average time
}

type PlayerRawData = Partial<Record<number, LevelVictories>>;

const randomBoolean = (chanceTrue: number): boolean => {
  return Math.random() < chanceTrue;
};

export const SampleGrid = () => {

    const lastWin = 11;
    const perfectChance = .5;
    const count = 150;
    const skippedChance = .05;

    const getThumbProps = (id: number) => {
      const isWon = id <= lastWin ? randomBoolean( 1 - skippedChance) : false;
      const isPerfect = isWon ? randomBoolean(perfectChance) : false;
      const color = createRandom();
      return {isWon, isPerfect, color};
    };

    const {width} = useDimensions();

    return (
        <View style={styles.centerContents}>
        <RenderGrid
            width={width * .9}
            count={count}
            getThumbProps={getThumbProps}
        />
        </View>
    )
};
