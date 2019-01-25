import { IProgressionExtrasStorageKeys } from '@achievements/models/progressionExtrasStorageKeys.model';
import { IProgressionBiomesStorageKeys } from '@achievements/models/progressionBiomesStorageKeys.model';
import { IProgressionObjectsStorageKeys } from '@achievements/models/progressionObjectsStorageKeys.model';
import { IProgressionCommonStorageKeys } from '@achievements/models/progressionCommonStorgeKeys.model';
import { IProgressionWeatherStorageKeys } from '@achievements/models/progressionWeatherStorageKeys.model';
import { IProgressionTrophiesStorageKeys } from '@achievements/models/progressionTrophiesStorageKeys.model';
import { IProgressionOnlineStorageKeys } from '@achievements/models/progressionOnline.model';

export interface IProgressionStorageKeys {
  common: IProgressionCommonStorageKeys;
  biomes: IProgressionBiomesStorageKeys;
  objects: IProgressionObjectsStorageKeys;
  weather: IProgressionWeatherStorageKeys;
  extras: IProgressionExtrasStorageKeys;
  trophies: IProgressionTrophiesStorageKeys;
  online: IProgressionOnlineStorageKeys;
}
