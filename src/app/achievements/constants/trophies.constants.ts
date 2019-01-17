import { ITrophy, IChecklistOption } from '@achievements/models/trophy.model';

import { PROGRESSION_COMMON_STORAGE_KEYS } from '@achievements/constants/progressionCommonStorageKeys.constants';
import { PROGRESSION_OBJECTS_STORAGE_KEYS } from '@achievements/constants/progressionObjectsStorageKeys.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';
import { PROGRESSION_TROPHIES_STORAG_KEYS } from '@achievements/constants/progressionTrophiesStorageKeys.constants';
import { PROGRESSION_WEATHER_STORAGE_KEYS } from '@achievements/constants/progressionWeatherStorageKeys.constants';
import { TRANSLATION_KEYS } from '@shared/constants/translationKeys.constants';

import { TROPHY_DIFFICULTY } from '@achievements/enums/trophyDIfficulty.enum';
import { TROPHY_TYPE } from '@achievements/enums/trophyType.enum';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';

export const TROPHIES: ITrophy[] = [
  // GAME
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.play_games_counter, options: { counter: 10 } },
    value: 'play ten games',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'jouer 10 fois', value: PROGRESSION_COMMON_STORAGE_KEYS.game_played, limit: 10 }
    ]
  },
  // BIOMES
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.visit_all_biomes },
    value: 'visit all biomes',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      ...Object.values(PROGRESSION_BIOME_STORAGE_KEYS).reduce((acc, name) => acc.concat(<IChecklistOption>{ name, value: name }), [])
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.visit_all_biomes, options: { counter: 10 } },
    value: 'visit all biomes five times',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      ...Object.values(PROGRESSION_BIOME_STORAGE_KEYS).reduce((acc, name) => acc.concat(<IChecklistOption>{ name, value: name, limit: 10 }), [])
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.going_underwater },
    value: 'going underwater',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'underwater', value: PROGRESSION_COMMON_STORAGE_KEYS.going_underwater }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.going_underwater_counter, options: { counter: 20 } },
    value: 'going underwater twenty times',
    img: '',
    difficulty: TROPHY_DIFFICULTY.GOLD,
    checklist: [
      { name: 'underwater', value: PROGRESSION_COMMON_STORAGE_KEYS.going_underwater, limit: 20 }
    ]
  },
  // OBJECTS
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.place_all_objects },
    value: 'place all objects',
    img: '',
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    checklist: [
      ...Object.values(PROGRESSION_OBJECTS_STORAGE_KEYS).reduce((acc, name) => acc.concat(<IChecklistOption>{ name, value: name }), [])
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.place_object },
    value: 'place 1 object',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'place 1 object', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.place_objects_counter, options: { counter: 10 } },
    value: 'place 10 objects',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'place 10 objects', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed, limit: 10 }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.place_objects_counter, options: { counter: 50 } },
    value: 'place 50 objects',
    img: '',
    difficulty: TROPHY_DIFFICULTY.GOLD,
    checklist: [
      { name: 'place 100 objects', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed, limit: 100 }
    ]
  },
  // DISTANCE
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.travelled_distance_counter, options: { counter: 1000000 } },
    value: 'travelled_1000000',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'parcourir 1000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled, limit: 1000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.travelled_distance_counter, options: { counter: 10000000 } },
    value: 'travelled_10000000',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'parcourir 10000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled, limit: 10000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.travelled_distance_counter, options: { counter: 100000000 } },
    value: 'travelled_100000000',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'parcourir 100000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled, limit: 100000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  // WEATHER
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.going_under_rain },
    value: 'going under rain',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'going under rain', value: PROGRESSION_WEATHER_STORAGE_KEYS.under_rain }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.go_in_sun },
    value: 'go in sun',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'go in sun', value: PROGRESSION_WEATHER_STORAGE_KEYS.in_sun }
    ]
  },
  // EXTRAS
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.repulse_fishes },
    value: 'repulse fishes',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'repulse fishes', value: PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_fishes }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.repulse_butterflies },
    value: 'repulse butterflies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'repulse butterflies', value: PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_butterflies }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.find_captain_treasure },
    value: 'find captain treasure',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'find captain treasure', value: PROGRESSION_EXTRAS_STORAGE_KEYS.find_captain_treasure }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.add_carrot_snowmnan },
    value: 'add carrot snowman',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    checklist: [
      { name: 'add carrot snowman', value: PROGRESSION_EXTRAS_STORAGE_KEYS.snowman_carrot }
    ]
  },
  // TROPHIES
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.unlock_trophy_percentage, options: { counter: 25 } },
    value: 'unlock 25 percent trophies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 25 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage, limit: 25, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.unlock_trophy_percentage, options: { counter: 50 } },
    value: 'unlock 50 percent trophies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 50 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage, limit: 50, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.unlock_trophy_percentage, options: { counter: 75 } },
    value: 'unlock 75 percent trophies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 75 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage, limit: 75, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: TRANSLATION_KEYS.TROPHIES.unlock_trophy_percentage, options: { counter: 100 } },
    value: 'unlock 100 percent trophies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 100 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage, limit: 100 }
    ]
  }
];
