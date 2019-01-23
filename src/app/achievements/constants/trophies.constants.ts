import { ITrophy, IChecklistOption } from '@achievements/models/trophy.model';
import { IProgression } from '@achievements/models/progression.model';

import { PROGRESSION_COMMON_STORAGE_KEYS } from '@achievements/constants/progressionCommonStorageKeys.constants';
import { PROGRESSION_OBJECTS_STORAGE_KEYS } from '@achievements/constants/progressionObjectsStorageKeys.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';
import { PROGRESSION_TROPHIES_STORAG_KEYS } from '@achievements/constants/progressionTrophiesStorageKeys.constants';
import { PROGRESSION_WEATHER_STORAGE_KEYS } from '@achievements/constants/progressionWeatherStorageKeys.constants';

import { TROPHY_DIFFICULTY } from '@achievements/enums/trophyDIfficulty.enum';
import { TROPHY_TYPE } from '@achievements/enums/trophyType.enum';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';

export const TROPHIES: ITrophy[] = [
  // GAME
  {
    name: { key: 'TROPHIES.play_games_counter', options: { counter: 2 } },
    value: 'play_two_games',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.GAME,
    checklist: [
      { name: 'jouer 2 fois', value: PROGRESSION_COMMON_STORAGE_KEYS.game_played.name, limit: 2 }
    ]
  },
  {
    name: { key: 'TROPHIES.play_games_counter', options: { counter: 10 } },
    value: 'play_ten_games',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.GAME,
    checklist: [
      { name: 'jouer 10 fois', value: PROGRESSION_COMMON_STORAGE_KEYS.game_played.name, limit: 10 }
    ]
  },
  // BIOMES
  {
    name: { key: 'TROPHIES.visit_all_biomes' },
    value: 'visit_all_biomes',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.BIOMES,
    checklist: [
      ...Object.values(PROGRESSION_BIOME_STORAGE_KEYS).reduce((acc, item: IProgression) => acc.concat(<IChecklistOption>{ name: item.name, value: item.name }), [])
    ]
  },
  {
    name: { key: 'TROPHIES.visit_all_biomes', options: { counter: 10 } },
    value: 'visit_all_biomes_five_times',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.BIOMES,
    checklist: [
      ...Object.values(PROGRESSION_BIOME_STORAGE_KEYS).reduce((acc, item: IProgression) => acc.concat(<IChecklistOption>{ name: item.name, value: item.name, limit: 10 }), [])
    ]
  },
  {
    name: { key: 'TROPHIES.going_underwater' },
    value: 'going_underwater',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.BIOMES,
    checklist: [
      { name: 'underwater', value: PROGRESSION_COMMON_STORAGE_KEYS.going_underwater.name }
    ]
  },
  {
    name: { key: 'TROPHIES.going_underwater_counter', options: { counter: 20 } },
    value: 'going_underwater_twenty_times',
    img: '',
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.BIOMES,
    checklist: [
      { name: 'underwater', value: PROGRESSION_COMMON_STORAGE_KEYS.going_underwater.name, limit: 20 }
    ]
  },
  // OBJECTS
  {
    name: { key: 'TROPHIES.place_all_objects' },
    value: 'place_all_objects',
    img: '',
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      ...Object.values(PROGRESSION_OBJECTS_STORAGE_KEYS).reduce((acc, item: IProgression) => acc.concat(<IChecklistOption>{ name: item.name, value: item.name }), [])
    ]
  },
  {
    name: { key: 'TROPHIES.place_object' },
    value: 'place_1_object',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'place 1 object', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed.name }
    ]
  },
  {
    name: { key: 'TROPHIES.place_objects_counter', options: { counter: 10 } },
    value: 'place_10_objects',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'place 10 objects', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed.name, limit: 10 }
    ]
  },
  {
    name: { key: 'TROPHIES.place_objects_counter', options: { counter: 50 } },
    value: 'place_50_objects',
    img: '',
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'place 100 objects', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed.name, limit: 100 }
    ]
  },
  // DISTANCE
  {
    name: { key: 'TROPHIES.travelled_distance_counter', options: { counter: 1000000 } },
    value: 'travelled_1000000',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.DISTANCE,
    checklist: [
      { name: 'parcourir 1000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled.name, limit: 1000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.travelled_distance_counter', options: { counter: 10000000 } },
    value: 'travelled_10000000',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.DISTANCE,
    checklist: [
      { name: 'parcourir 10000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled.name, limit: 10000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.travelled_distance_counter', options: { counter: 100000000 } },
    value: 'travelled_100000000',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.DISTANCE,
    checklist: [
      { name: 'parcourir 100000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled.name, limit: 100000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  // WEATHER
  {
    name: { key: 'TROPHIES.going_under_rain' },
    value: 'going_under_rain',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.WEATHER,
    checklist: [
      { name: 'going under rain', value: PROGRESSION_WEATHER_STORAGE_KEYS.under_rain.name }
    ]
  },
  {
    name: { key: 'TROPHIES.go_in_sun' },
    value: 'go_in_sun',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.WEATHER,
    checklist: [
      { name: 'go in sun', value: PROGRESSION_WEATHER_STORAGE_KEYS.in_sun.name }
    ]
  },
  // EXTRAS
  {
    name: { key: 'TROPHIES.repulse_fishes' },
    value: 'repulse_fishes',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'repulse fishes', value: PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_fishes.name }
    ]
  },
  {
    name: { key: 'TROPHIES.repulse_butterflies' },
    value: 'repulse_butterflies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'repulse butterflies', value: PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_butterflies.name }
    ]
  },
  {
    name: { key: 'TROPHIES.find_captain_treasure' },
    value: 'find_captain_treasure',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'find captain treasure', value: PROGRESSION_EXTRAS_STORAGE_KEYS.find_captain_treasure.name }
    ]
  },
  {
    name: { key: 'TROPHIES.add_carrot_snowmnan' },
    value: 'add_carrot_snowman',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'add carrot snowman', value: PROGRESSION_EXTRAS_STORAGE_KEYS.snowman_carrot.name }
    ]
  },
  // TROPHIES
  {
    name: { key: 'TROPHIES.unlock_trophy_percentage', options: { counter: 25 } },
    value: 'unlock_25_percent_trophies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 25 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage.name, limit: 25, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.unlock_trophy_percentage', options: { counter: 50 } },
    value: 'unlock_50_percent_trophies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 50 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage.name, limit: 50, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.unlock_trophy_percentage', options: { counter: 75 } },
    value: 'unlock_75_percent_trophies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 75 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage.name, limit: 75, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.unlock_trophy_percentage', options: { counter: 100 } },
    value: 'unlock_100_percent_trophies',
    img: '',
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 100 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage.name, limit: 100 }
    ]
  }
];
