import { IProgressionStorageKey } from '@achievements/models/progressionStorageKey.model';
import { PROGRESSION_OBJECTS_STORAGE_KEYS } from './progressionObjectsStorageKey.constants';

export const PROGRESSION_STORAGE_KEYS: IProgressionStorageKey = {
  game_played: 'game_played',
  desert_visited: 'desert_visited',
  greenland_visited: 'greenland_visited',
  highland_visited: 'highland_visited',
  ocean_visited: 'ocean_visited',
  rainforest_visited: 'rainforest_visited',
  snow_visited: 'snow_visited',
  swamp_visited: 'swamp_visited',
  objects_placed: 'objects_placed',
  ...PROGRESSION_OBJECTS_STORAGE_KEYS
};
