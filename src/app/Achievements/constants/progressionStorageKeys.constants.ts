import { IProgressionStorageKeys } from '@achievements/models/progressionStorageKeys.model';

import { PROGRESSION_BIOME_STORAGE_KEYS } from './progressionBiomesStorageKeys.constants';
import { PROGRESSION_OBJECTS_STORAGE_KEYS } from './progressionObjectsStorageKeys.constants';
import { PROGRESSION_COMMON_STORAGE_KEYS } from './progressionCommonStorageKeys.constants';

import CommonUtils from '@shared/utils/Common.utils';

export const PROGRESSION_STORAGE_KEYS: IProgressionStorageKeys = {
  common: PROGRESSION_COMMON_STORAGE_KEYS,
  biomes: PROGRESSION_BIOME_STORAGE_KEYS,
  objects: PROGRESSION_OBJECTS_STORAGE_KEYS
};

export const PROGRESSION_STORAGE = {
  ...CommonUtils.arrayToObject([
    ...Object.values(PROGRESSION_STORAGE_KEYS).reduce((acc, item) => acc.concat(CommonUtils.objectToArray(item)), [])
  ], 0)
};
