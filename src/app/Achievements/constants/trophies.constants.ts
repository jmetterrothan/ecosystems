import { ITrophy, IChecklistOption } from '@achievements/models/trophy.model';

import { TROPHY_DIFFICULTY } from '@shared/enums/trophyDIfficulty.enum';
import { PROGRESSION_COMMON_STORAGE_KEYS } from '@achievements/constants/progressionCommonStorageKeys.constants';
import { PROGRESSION_OBJECTS_STORAGE_KEYS } from '@achievements/constants/progressionObjectsStorageKeys.constants';

export const TROPHIES: ITrophy[] = [
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
    name: 'Jouer 10 parties',
    value: 'play ten games',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    completed: false,
    checklist: [
      { name: 'jouer 10 fois', value: PROGRESSION_COMMON_STORAGE_KEYS.game_played, limit: 10 }
    ]
  },
  {
    name: 'Placer tous les objets',
    value: 'place all objects',
    img: '',
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    completed: false,
    checklist: [
      ...Object.values(PROGRESSION_OBJECTS_STORAGE_KEYS).reduce((acc, name) => acc.concat(<IChecklistOption>{ name, value: name }), [])
    ]
  }
];
