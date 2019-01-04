import { IProgressionStorageKeys } from '@achievements/models/progressionStorageKeys.model';

import { PROGRESSION_OBJECTS_STORAGE_KEYS } from './progressionObjectsStorageKey.constants';
import { PROGRESSION_COMMON_STORAGE_KEYS } from './progressionCommonStorageKeys.constants';

export const PROGRESSION_STORAGE_KEYS: IProgressionStorageKeys = {
  common: PROGRESSION_COMMON_STORAGE_KEYS,
  objects: PROGRESSION_OBJECTS_STORAGE_KEYS
};
