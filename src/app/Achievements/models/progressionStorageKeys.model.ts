import { IProgressionObjectsStorageKeys } from '@achievements/models/progressionObjectsStorageKeys.model';
import { IProgressionCommonStorageKeys } from '@achievements/models/progressionCommonStorgeKeys.model';
export interface IProgressionStorageKeys {
  common: IProgressionCommonStorageKeys;
  objects: IProgressionObjectsStorageKeys;
}
