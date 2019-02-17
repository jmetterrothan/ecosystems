import { IProgression } from '@achievements/models/progression.model';

export interface IProgressionCommonStorageKeys {
  game_played: IProgression;
  distance_travelled: IProgression;
  going_underwater: IProgression;
  objects_placed: IProgression;
  objects_placed_submarine: IProgression;
  objects_placed_voice: IProgression;
  objects_removed: IProgression;
}
