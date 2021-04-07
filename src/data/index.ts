import {I_PackPlay, LevelData} from "./types";
import data from "./levels.json";
import {JsonPack} from "./JsonPack";
import {BoxLevelProps} from "../components/game/BoxLevel2";

export const DESIGNED_LEVELS: I_PackPlay<BoxLevelProps> = new JsonPack(data as LevelData[]);
