import {I_PackPlay, LevelData} from "./types";
import {BoxLevel, BoxLevelProps} from "../components/game/BoxLevel2";
import {FromGetStats} from "../components/game/RenderWin";

/**
 * class which takes a raw JSON object of level data and fits it to the I_PackPlay interface
 */

export class JsonPack implements I_PackPlay<BoxLevelProps> {

    private readonly data: LevelData[];

    constructor(data: LevelData[]) {
        this.data = data;
    }

    public isValidLevel(id: number): boolean {
        return id < this.data.length - 1;
    }

    public hasNextLevel(currentId: number): boolean {
        return this.isValidLevel(currentId + 1);
    }

    public getLevelProps(id: number): BoxLevelProps {
        //ball id an initialSlot inferred from array position
        const {balls, ...levelData} = this.data[id];
        return {
            ...levelData,
            balls: balls.map((ball, i) => ({
                ...ball,
                initialSlot: i,
                id: i,
            }))
        }
    }

    public nextLevelProps(currentId: number): BoxLevelProps | null {
        if (!this.hasNextLevel(currentId)) {
            return null;
        } else {
            return this.getLevelProps(currentId + 1);
        }
    }

    public getStats(props: BoxLevelProps & { id: number }): FromGetStats {
        //TODO
        return {
            fewestMoves: 99
        }
    }

    public Render = BoxLevel;
}
