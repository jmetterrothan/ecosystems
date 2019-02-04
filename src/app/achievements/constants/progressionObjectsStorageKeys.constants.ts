import { IProgressionObjectsStorageKeys } from '@achievements/models/progressionObjectsStorageKeys.model';

import { IProgression } from '@achievements/models/progression.model';

import { SubBiomes } from '@world/constants/subBiomes.constants';

import CommonUtils from '@shared/utils/Common.utils';

export const PROGRESSION_OBJECTS_STORAGE_KEYS: IProgressionObjectsStorageKeys =
  Object.values(SubBiomes).reduce((acc, biome) => acc.concat(biome.organisms), [])
    .reduce((acc, organism) => acc.concat(organism.name), [])
    .map(name => CommonUtils.getObjectPlacedNameForAchievement(name))
    .reduce((acc, name) => {
      const progression: IProgression = { name, value: name, show: false };
      acc[name] = progression;
      return acc;
    }, {});
