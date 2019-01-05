import { ITrophy, IChecklistOption } from '@achievements/models/trophy.model';

import { TROPHY_DIFFICULTY } from '@shared/enums/trophyDIfficulty.enum';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';

import { PROGRESSION_COMMON_STORAGE_KEYS } from '@achievements/constants/progressionCommonStorageKeys.constants';
import { PROGRESSION_OBJECTS_STORAGE_KEYS } from '@achievements/constants/progressionObjectsStorageKeys.constants';

export const TROPHIES: ITrophy[] = [
  // GAME
  {
    name: 'Jouer 10 parties',
    value: 'play ten games',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    completed: false,
    checklist: [
      { name: 'jouer 10 fois', value: PROGRESSION_COMMON_STORAGE_KEYS.game_played, limit: 10 }
    ]
  },
  // BIOMES
  {
    name: 'Visiter tous les biomes',
    value: 'visit all biomes',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    completed: false,
    checklist: [
      { name: 'desert', value: PROGRESSION_COMMON_STORAGE_KEYS.desert_visited },
      { name: 'greenland', value: PROGRESSION_COMMON_STORAGE_KEYS.greenland_visited },
      { name: 'highland', value: PROGRESSION_COMMON_STORAGE_KEYS.highland_visited },
      { name: 'ocean', value: PROGRESSION_COMMON_STORAGE_KEYS.ocean_visited },
      { name: 'rainforest', value: PROGRESSION_COMMON_STORAGE_KEYS.rainforest_visited },
      { name: 'snow', value: PROGRESSION_COMMON_STORAGE_KEYS.snow_visited },
      { name: 'swamp', value: PROGRESSION_COMMON_STORAGE_KEYS.swamp_visited },
    ]
  },
  {
    name: 'Visiter 5 fois tous les biomes',
    value: 'visit all biomes five times',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    completed: false,
    checklist: [
      { name: 'desert', value: PROGRESSION_COMMON_STORAGE_KEYS.desert_visited, limit: 5 },
      { name: 'greenland', value: PROGRESSION_COMMON_STORAGE_KEYS.greenland_visited, limit: 5 },
      { name: 'highland', value: PROGRESSION_COMMON_STORAGE_KEYS.highland_visited, limit: 5 },
      { name: 'ocean', value: PROGRESSION_COMMON_STORAGE_KEYS.ocean_visited, limit: 5 },
      { name: 'rainforest', value: PROGRESSION_COMMON_STORAGE_KEYS.rainforest_visited, limit: 5 },
      { name: 'snow', value: PROGRESSION_COMMON_STORAGE_KEYS.snow_visited, limit: 5 },
      { name: 'swamp', value: PROGRESSION_COMMON_STORAGE_KEYS.swamp_visited, limit: 5 },
    ]
  },
  // OBJECTS
  {
    name: 'Placer tous les objets',
    value: 'place all objects',
    img: '',
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    completed: false,
    checklist: [
      ...Object.values(PROGRESSION_OBJECTS_STORAGE_KEYS).reduce((acc, name) => acc.concat(<IChecklistOption>{ name, value: name }), [])
    ]
  },
  // DISTANCE
  {
    name: 'Parcourir 1 000 000 unités',
    value: 'travelled_1000000',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    completed: false,
    checklist: [
      { name: 'parcourir 1000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled, limit: 1000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  }
];
