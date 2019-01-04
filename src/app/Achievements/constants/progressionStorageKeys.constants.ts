import { PROGRESSION_OBJECTS_STORAGE_KEYS } from './progressionObjectsStorageKeys.constants';
import { PROGRESSION_COMMON_STORAGE_KEYS } from './progressionCommonStorageKeys.constants';
import { IProgressionStorageKeys } from '@achievements/models/progressionStorageKeys.model';

import CommonUtils from '@shared/utils/Common.utils';

export const PROGRESSION_STORAGE_KEYS: IProgressionStorageKeys = {
  common: PROGRESSION_COMMON_STORAGE_KEYS,
  objects: PROGRESSION_OBJECTS_STORAGE_KEYS
};

export const PROGRESSION_STORAGE = {
  ...CommonUtils.arrayToObject([
    ...CommonUtils.objectToArray(PROGRESSION_COMMON_STORAGE_KEYS),
    ...CommonUtils.objectToArray(PROGRESSION_OBJECTS_STORAGE_KEYS)
  ], 0)
};
