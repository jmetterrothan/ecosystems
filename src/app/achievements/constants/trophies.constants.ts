import { ITrophy, IChecklistOption } from '@achievements/models/trophy.model';
import { IProgression } from '@achievements/models/progression.model';

import { PROGRESSION_COMMON_STORAGE_KEYS } from '@achievements/constants/progressionCommonStorageKeys.constants';
import { PROGRESSION_OBJECTS_STORAGE_KEYS, getProgressionKeysFromObjectsOfType } from '@achievements/constants/progressionObjectsStorageKeys.constants';
import { PROGRESSION_BIOME_STORAGE_KEYS } from '@achievements/constants/progressionBiomesStorageKeys.constants';
import { PROGRESSION_EXTRAS_STORAGE_KEYS } from '@achievements/constants/progressionExtrasStorageKeys.constants';
import { PROGRESSION_TROPHIES_STORAG_KEYS } from '@achievements/constants/progressionTrophiesStorageKeys.constants';
import { PROGRESSION_WEATHER_STORAGE_KEYS } from '@achievements/constants/progressionWeatherStorageKeys.constants';
import { PROGRESSION_ONLINE_STORAGE_KEYS } from '@achievements/constants/progressionOnlineStorageKeys.constants';

import { TROPHY_DIFFICULTY } from '@achievements/enums/trophyDIfficulty.enum';
import { TROPHY_TYPE } from '@achievements/enums/trophyType.enum';
import { COMPARISON_TYPE } from '@shared/enums/comparaison.enum';
import { OBJ_TYPE } from '@app/shared/enums/objectTypes.enum';

import IconTrophyBiomes from '!svg-react-loader!@images/icon_set_optimized/icon01.svg';
import IconTrophyObject from '!svg-react-loader!@images/icon_set_optimized/icon02.svg';
import IconTrophyMap from '!svg-react-loader!@images/icon_set_optimized/icon03.svg';
import IconTrophyChest from '!svg-react-loader!@images/icon_set_optimized/icon04.svg';
import IconTrophyObjectUnderwater from '!svg-react-loader!@images/icon_set_optimized/icon05.svg';
import IconTrophyDive from '!svg-react-loader!@images/icon_set_optimized/icon06.svg';
import IconTrophyScarecrow from '!svg-react-loader!@images/icon_set_optimized/icon07.svg';
import IconTrophySnowman from '!svg-react-loader!@images/icon_set_optimized/icon08.svg';
import IconTrophyFishs from '!svg-react-loader!@images/icon_set_optimized/icon09.svg';
import IconTrophyButterflies from '!svg-react-loader!@images/icon_set_optimized/icon10.svg';
import IconTrophySun from '!svg-react-loader!@images/icon_set_optimized/icon11.svg';
import IconTrophyBones from '!svg-react-loader!@images/icon_set_optimized/icon12.svg';
import IconTrophy from '!svg-react-loader!@images/icon_set_optimized/icon13.svg';
import IconTrophy25 from '!svg-react-loader!@images/icon_set_optimized/icon14.svg';
import IconTrophy50 from '!svg-react-loader!@images/icon_set_optimized/icon15.svg';
import IconTrophy75 from '!svg-react-loader!@images/icon_set_optimized/icon16.svg';
import IconTrophy100 from '!svg-react-loader!@images/icon_set_optimized/icon17.svg';
import IconTrophyOnline from '!svg-react-loader!@images/icon_set_optimized/icon18.svg';
import IconTrophyRain from '!svg-react-loader!@images/icon_set_optimized/icon19.svg';
import IconTrophyMoon from '!svg-react-loader!@images/icon_set_optimized/icon20.svg';
import IconTrophyWoodcutter from '!svg-react-loader!@images/icon_set_optimized/icon21.svg';
import IconTrophyFlowers from '!svg-react-loader!@images/icon_set_optimized/icon22.svg';
import IconTrophyMushrooms from '!svg-react-loader!@images/icon_set_optimized/icon23.svg';

export const TROPHIES: ITrophy[] = [
  // GAME
  {
    name: { key: 'TROPHIES.play_games_counter', options: { counter: 2 } },
    value: 'play_two_games',
    Icon: IconTrophy,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.GAME,
    checklist: [
      { name: 'jouer 2 fois', value: PROGRESSION_COMMON_STORAGE_KEYS.game_played.value, limit: 2 }
    ]
  },
  {
    name: { key: 'TROPHIES.play_games_counter', options: { counter: 10 } },
    value: 'play_ten_games',
    Icon: IconTrophy,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.GAME,
    checklist: [
      { name: 'jouer 10 fois', value: PROGRESSION_COMMON_STORAGE_KEYS.game_played.value, limit: 10 }
    ]
  },
  // BIOMES
  {
    name: { key: 'TROPHIES.visit_all_biomes' },
    value: 'visit_all_biomes',
    Icon: IconTrophyBiomes,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.BIOMES,
    checklist: [
      ...Object.values(PROGRESSION_BIOME_STORAGE_KEYS).reduce((acc, item: IProgression) => acc.concat(<IChecklistOption>{ name: item.name, value: item.value }), [])
    ]
  },
  {
    name: { key: 'TROPHIES.going_underwater' },
    value: 'going_underwater',
    Icon: IconTrophyDive,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.BIOMES,
    checklist: [
      { name: 'underwater', value: PROGRESSION_COMMON_STORAGE_KEYS.going_underwater.value }
    ]
  },
  {
    name: { key: 'TROPHIES.going_underwater_counter', options: { counter: 10 } },
    value: 'going_underwater_twenty_times',
    Icon: IconTrophyDive,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.BIOMES,
    checklist: [
      { name: 'underwater', value: PROGRESSION_COMMON_STORAGE_KEYS.going_underwater.value, limit: 10 }
    ]
  },
  // OBJECTS
  {
    name: { key: 'TROPHIES.place_all_objects' },
    value: 'place_all_objects',
    Icon: IconTrophyObject,
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    type: TROPHY_TYPE.OBJECTS,
    percentage: 85,
    checklist: [
      ...Object.values(PROGRESSION_OBJECTS_STORAGE_KEYS).reduce((acc, item: IProgression) => acc.concat(<IChecklistOption>{ name: item.name, value: item.value }), [])
    ]
  },
  {
    name: { key: 'TROPHIES.place_object' },
    value: 'place_1_object',
    Icon: IconTrophyObject,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'place 1 object', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed.value }
    ]
  },
  {
    name: { key: 'TROPHIES.place_object_submarine' },
    value: 'place_object_submarine',
    Icon: IconTrophyObjectUnderwater,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'place 1 submarine object', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed_submarine.value }
    ]
  },
  {
    name: { key: 'TROPHIES.place_object_voice' },
    value: 'place_object_voice',
    Icon: IconTrophyObject,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'place 1 object with voice', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed_voice.value }
    ]
  },
  {
    name: { key: 'TROPHIES.place_objects_counter', options: { counter: 10 } },
    value: 'place_10_objects',
    Icon: IconTrophyObject,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'place 10 objects', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed.value, limit: 10 }
    ]
  },
  {
    name: { key: 'TROPHIES.place_objects_counter', options: { counter: 50 } },
    value: 'place_50_objects',
    Icon: IconTrophyObject,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'place 50 objects', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_placed.value, limit: 50 }
    ]
  },
  {
    name: { key: 'TROPHIES.mushrooms_soup' },
    value: 'mushrooms_soup',
    Icon: IconTrophyMushrooms,
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    type: TROPHY_TYPE.OBJECTS,
    percentage: 80,
    checklist: [
      ...getProgressionKeysFromObjectsOfType(OBJ_TYPE.MUSHROOM).map((progression: IProgression) => <IChecklistOption>{ name: progression.name, value: progression.value })
    ]
  },
  {
    name: { key: 'TROPHIES.bunch_of_flowers' },
    value: 'bunch_of_flowers',
    Icon: IconTrophyFlowers,
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    type: TROPHY_TYPE.OBJECTS,
    percentage: 80,
    checklist: [
      ...getProgressionKeysFromObjectsOfType(OBJ_TYPE.FLOWER).map((progression: IProgression) => <IChecklistOption>{ name: progression.name, value: progression.value })
    ]
  },
  {
    name: { key: 'TROPHIES.remove_object' },
    value: 'remove_1_object',
    Icon: IconTrophy,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'remove one object', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_removed.value }
    ]
  },
  {
    name: { key: 'TROPHIES.remove_objects_counter', options: { counter: 10 } },
    value: 'remove_10_objects',
    Icon: IconTrophy,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.OBJECTS,
    checklist: [
      { name: 'remove 10 objects', value: PROGRESSION_COMMON_STORAGE_KEYS.objects_removed.value, limit: 10 }
    ]
  },
  // DISTANCE
  {
    name: { key: 'TROPHIES.travelled_distance_counter', options: { counter: 2 } },
    value: 'travelled_1000000',
    Icon: IconTrophyMap,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.DISTANCE,
    checklist: [
      { name: 'parcourir 2000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled.value, limit: 2000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.travelled_distance_counter', options: { counter: 25 } },
    value: 'travelled_25000000',
    Icon: IconTrophyMap,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.DISTANCE,
    checklist: [
      { name: 'parcourir 10000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled.value, limit: 25000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.travelled_distance_counter', options: { counter: 50 } },
    value: 'travelled_50000000',
    Icon: IconTrophyMap,
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    type: TROPHY_TYPE.DISTANCE,
    checklist: [
      { name: 'parcourir 50000000 unites', value: PROGRESSION_COMMON_STORAGE_KEYS.distance_travelled.value, limit: 50000000, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  // WEATHER
  {
    name: { key: 'TROPHIES.going_under_rain' },
    value: 'going_under_rain',
    Icon: IconTrophyRain,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.WEATHER,
    checklist: [
      { name: 'going under rain', value: PROGRESSION_WEATHER_STORAGE_KEYS.under_rain.value }
    ]
  },
  {
    name: { key: 'TROPHIES.go_in_sun' },
    value: 'go_in_sun',
    Icon: IconTrophySun,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.WEATHER,
    checklist: [
      { name: 'go in sun', value: PROGRESSION_WEATHER_STORAGE_KEYS.in_sun.value }
    ]
  },
  {
    name: { key: 'TROPHIES.go_in_moon' },
    value: 'go_in_moon',
    Icon: IconTrophyMoon,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.WEATHER,
    checklist: [
      { name: 'go in moon', value: PROGRESSION_WEATHER_STORAGE_KEYS.in_moon.value }
    ]
  },
  // EXTRAS
  {
    name: { key: 'TROPHIES.repulse_fishes' },
    value: 'repulse_fishes',
    Icon: IconTrophyFishs,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'repulse fishes', value: PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_fishes.value }
    ]
  },
  {
    name: { key: 'TROPHIES.repulse_butterflies' },
    value: 'repulse_butterflies',
    Icon: IconTrophyButterflies,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'repulse butterflies', value: PROGRESSION_EXTRAS_STORAGE_KEYS.repulse_butterflies.value }
    ]
  },
  {
    name: { key: 'TROPHIES.find_captain_treasure' },
    value: 'find_captain_treasure',
    Icon: IconTrophyChest,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'find captain treasure', value: PROGRESSION_EXTRAS_STORAGE_KEYS.find_captain_treasure.value }
    ]
  },
  {
    name: { key: 'TROPHIES.add_carrot_snowmnan' },
    value: 'add_carrot_snowman',
    Icon: IconTrophySnowman,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'add carrot snowman', value: PROGRESSION_EXTRAS_STORAGE_KEYS.snowman_carrot.value }
    ]
  },
  {
    name: { key: 'TROPHIES.find_scarecrow' },
    value: 'find_scarecrow',
    Icon: IconTrophyScarecrow,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'find scarecrow', value: PROGRESSION_EXTRAS_STORAGE_KEYS.find_scarecrow.value }
    ]
  },
  {
    name: { key: 'TROPHIES.archaeology' },
    value: 'archaeology',
    Icon: IconTrophyBones,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'archaeology', value: PROGRESSION_EXTRAS_STORAGE_KEYS.archaeology.value }
    ]
  },
  {
    name: { key: 'TROPHIES.woodcutter' },
    value: 'woodcutter',
    Icon: IconTrophyWoodcutter,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'woodcutter', value: PROGRESSION_EXTRAS_STORAGE_KEYS.woodcutter.value }
    ]
  },
  {
    name: { key: 'TROPHIES.under_map' },
    value: 'under_map',
    Icon: IconTrophy,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'under map', value: PROGRESSION_EXTRAS_STORAGE_KEYS.under_map.value }
    ]
  },
  {
    name: { key: 'TROPHIES.weird_mushroom' },
    value: 'weird_mushroom',
    Icon: IconTrophy,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.EXTRAS,
    checklist: [
      { name: 'weird mushroom', value: PROGRESSION_EXTRAS_STORAGE_KEYS.weird_mushroom.value }
    ]
  },
  // ONLINE
  {
    name: { key: 'TROPHIES.play_online' },
    value: 'play_online',
    Icon: IconTrophyOnline,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.ONLINE,
    checklist: [
      { name: 'play online', value: PROGRESSION_ONLINE_STORAGE_KEYS.play_online.value }
    ]
  },
  {
    name: { key: 'TROPHIES.place_object_online' },
    value: 'place_object_online',
    Icon: IconTrophyOnline,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.ONLINE,
    checklist: [
      { name: 'place object online', value: PROGRESSION_ONLINE_STORAGE_KEYS.place_object_online.value }
    ]
  },
  // TROPHIES
  {
    name: { key: 'TROPHIES.unlock_trophy_percentage', options: { counter: 25 } },
    value: 'unlock_25_percent_trophies',
    Icon: IconTrophy25,
    difficulty: TROPHY_DIFFICULTY.BRONZE,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 25 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage.value, limit: 25, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.unlock_trophy_percentage', options: { counter: 50 } },
    value: 'unlock_50_percent_trophies',
    Icon: IconTrophy50,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 50 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage.value, limit: 50, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.unlock_trophy_percentage', options: { counter: 75 } },
    value: 'unlock_75_percent_trophies',
    Icon: IconTrophy75,
    difficulty: TROPHY_DIFFICULTY.GOLD,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 75 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage.value, limit: 75, comparison: COMPARISON_TYPE.SUPERIOR }
    ]
  },
  {
    name: { key: 'TROPHIES.unlock_trophy_percentage', options: { counter: 100 } },
    value: 'unlock_100_percent_trophies',
    Icon: IconTrophy100,
    difficulty: TROPHY_DIFFICULTY.DIAMOND,
    type: TROPHY_TYPE.TROPHY,
    checklist: [
      { name: 'unlock 100 percent', value: PROGRESSION_TROPHIES_STORAG_KEYS.unlock_trophies_percentage.value, limit: 100 }
    ]
  }
];
