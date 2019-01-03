import { ITrophy } from '@achievements/models/trophy.model';

import { PROGRESSION_STORAGE_KEYS } from '@achievements/constants/progression.constants';
import { TROPHY_DIFFICULTY } from '@shared/enums/trophyDIfficulty.enum';

export const TROPHIES: ITrophy[] = [
  {
    name: 'Visiter tous les biomes',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    completed: false,
    checklist: [
      { name: 'desert', value: PROGRESSION_STORAGE_KEYS.desert_visited_count },
      { name: 'greenland', value: PROGRESSION_STORAGE_KEYS.greenland_visited_count },
      { name: 'highland', value: PROGRESSION_STORAGE_KEYS.highland_visited_count },
      { name: 'ocean', value: PROGRESSION_STORAGE_KEYS.ocean_visited_count },
      { name: 'rainforest', value: PROGRESSION_STORAGE_KEYS.rainforest_visited_count },
      { name: 'snow', value: PROGRESSION_STORAGE_KEYS.snow_visited_count },
      { name: 'swamp', value: PROGRESSION_STORAGE_KEYS.swamp_visited_count },
    ]
  }
];
