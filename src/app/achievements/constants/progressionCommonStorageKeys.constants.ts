import { IProgressionCommonStorageKeys } from '@achievements/models/progressionCommonStorgeKeys.model';

export const PROGRESSION_COMMON_STORAGE_KEYS: IProgressionCommonStorageKeys = {
  game_played: {
    name: 'game_played',
    value: 'game_played',
    show: true
  },
  distance_travelled: {
    name: 'distance_travelled',
    value: 'distance_travelled',
    show: true,
    callback: value => +(value / 1000000).toFixed(2)
  },
  going_underwater: {
    name: 'going_underwater',
    value: 'going_underwater',
    show: true
  },
  objects_placed: {
    name: 'objects_placed',
    value: 'objects_placed',
    show: true
  },
  objects_placed_submarine: {
    name: 'objects_placed_submarine',
    value: 'objects_placed_submarine',
    show: true
  },
  objects_placed_voice: {
    name: 'objects_placed_voice',
    value: 'objects_placed_voice',
    show: true
  },
  objects_removed: {
    name: 'objects_removed',
    value: 'objects_removed',
    show: true
  }
};
