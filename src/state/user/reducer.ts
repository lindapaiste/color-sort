import {COMPLETE_LEVEL, UPDATE_SETTINGS, VictoryData, UserActionTypes, SettingsShape} from "./types";
import {combineReducers} from "redux";

export const levelData = (state: VictoryData = {}, action: UserActionTypes): VictoryData => {
    switch ( action.type ) {
        case COMPLETE_LEVEL:
            const {level, moves, time} = action.payload;
            const {timestamp} = action.meta;
            const previous = state[level] || [];
            return {
                ...state,
                [level]: [
                    {
                        moves,
                        time,
                        timestamp,
                    }, //put the newest first because of typescript, where we require index 0 to be set
                    ...previous,
                ]
            };
        default:
            return state;
    }
};

export const DEFAULT_SETTINGS: SettingsShape = {
    volume: 1,
    isSoundOn: true,
    isShowCheck: true,
    isLockCorrect: false,
};

export const settings = (state: SettingsShape = DEFAULT_SETTINGS, action: UserActionTypes): SettingsShape => {
  switch ( action.type ) {
      case UPDATE_SETTINGS:
          const {setting, value} = action.payload;
          return {
              ...state,
              [setting]: value,
          };
      default:
          return state;
  }
};

/**
 * can have other sections like preferences, purchases, etc.
 */

export interface StateShape {
    levelData: VictoryData,
    settings: SettingsShape,
}

export const reducer = combineReducers<StateShape>({
    levelData,
    settings,
});
