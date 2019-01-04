import { IProgressionStorageKey } from '@achievements/models/progressionStorageKey.model';
import { PROGRESSION_OBJECTS_STORAGE_KEYS } from './progressionObjectsStorageKey.constants';

export const PROGRESSION_STORAGE_KEYS: IProgressionStorageKey = {
  game_played_count: 'game_played_count',
  desert_visited_count: 'desert_visited_count',
  greenland_visited_count: 'greenland_visited_count',
  highland_visited_count: 'highland_visited_count',
  ocean_visited_count: 'ocean_visited_count',
  rainforest_visited_count: 'rainforest_visited_count',
  snow_visited_count: 'snow_visited_count',
  swamp_visited_count: 'swamp_visited_count',
  objects_placed_count: 'objects_placed_count',
  ...PROGRESSION_OBJECTS_STORAGE_KEYS
};
