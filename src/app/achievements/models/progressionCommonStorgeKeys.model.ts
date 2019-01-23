import { IProgression } from '@achievements/models/progression.model';

export interface IProgressionCommonStorageKeys {
  game_played: IProgression;
  distance_travelled: IProgression;
  going_underwater: IProgression;
  objects_placed: IProgression;
}
