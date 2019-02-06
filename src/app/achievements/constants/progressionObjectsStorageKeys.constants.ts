import { IProgressionObjectsStorageKeys } from '@achievements/models/progressionObjectsStorageKeys.model';

import { IProgression } from '@achievements/models/progression.model';
import { IObject } from '@app/shared/models/object.model';

import { SUB_BIOMES } from '@world/constants/subBiomes.constants';
import { getObjectsOfType } from '@shared/constants/object.constants';

import { OBJ_TYPE } from '@app/shared/enums/objectTypes.enum';

import CommonUtils from '@shared/utils/Common.utils';

export const PROGRESSION_OBJECTS_STORAGE_KEYS: IProgressionObjectsStorageKeys =
  Object.values(SUB_BIOMES).reduce((acc, biome) => acc.concat(biome.organisms), [])
    .reduce((acc, organism) => acc.concat(organism.name), [])
    .map(name => CommonUtils.getObjectPlacedNameForAchievement(name))
    .reduce((acc, name) => {
      const progression: IProgression = { name, value: name, show: false };
      acc[name] = progression;
      return acc;
    }, {});

export const getProgressionKeysFromObjectsOfType = (type: OBJ_TYPE) => {
  return getObjectsOfType(type)
    .map((obj: IObject) => PROGRESSION_OBJECTS_STORAGE_KEYS[CommonUtils.getObjectPlacedNameForAchievement(obj.name)])
    .filter(res => res !== undefined);
};
