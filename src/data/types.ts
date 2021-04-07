import {BallData, BoxData} from "../state/slotSwap/types";
import {ComponentType} from "react";
import {PlayGeneratesProps} from "../components/game/PlayScreen";
import {FromGetStats as Stats} from "../components/game/RenderWin";


//slot doesn't know what box it's in without knowing ballsPerRow and rowsPerBox -- is this a bad design?

/**
 * are id and initial slot needed, or are they inferred by the order of the balls?
 */

export interface LevelData {
    boxes: BoxData[];
    balls: Pick<BallData, 'color' | 'correctBox'>[];
    //minimum moves?
    ballsPerRow: number;
    rowsPerBox: number;
}

/**
 * not sure whether to add to Props to Render or omit from Props for generators
 */
type RenderComponent<Props> = ComponentType<Props & PlayGeneratesProps>
type LevelProps<Props> = Omit<Props, keyof PlayGeneratesProps>

/**
 * a level pack is defined by a Render Component and an array of levels
 * which are props for the Render
 */
export interface DefinedPack<Props extends {}> {
    Render: RenderComponent<Props>,
    levels: Array<Props>,
}

/**
 * want to be able to play both defined and infinite packs
 */
export interface I_PackPlay<Props extends {}> {
    //want this to be a method, which is fine as long as Render is not a class component
    Render: RenderComponent<Props>,

    getLevelProps(id: number): Props,

    hasNextLevel(currentId: number): boolean,

    nextLevelProps(currentId: number): Props | null, //return null on last level
    //win screen props
    getStats(props: Props & { id: number }): Stats,
}
