import { IProgressionBiomesStorageKeys } from '@achievements/models/progressionBiomesStorageKeys.model';
import { IProgressionObjectsStorageKeys } from '@achievements/models/progressionObjectsStorageKeys.model';
import { IProgressionCommonStorageKeys } from '@achievements/models/progressionCommonStorgeKeys.model';

export interface IProgressionStorageKeys {
  common: IProgressionCommonStorageKeys;
  biomes: IProgressionBiomesStorageKeys;
  objects: IProgressionObjectsStorageKeys;
}
