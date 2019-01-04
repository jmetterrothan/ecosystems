export interface IProgressionStorageKey {
  game_played: string;
  desert_visited: string;
  greenland_visited: string;
  highland_visited: string;
  ocean_visited: string;
  rainforest_visited: string;
  snow_visited: string;
  swamp_visited: string;
  objects_placed: string;
  [objectPlaced: string]: string;
}
