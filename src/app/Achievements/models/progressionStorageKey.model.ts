export interface IProgressionStorageKey {
  game_played_count: string;
  desert_visited_count: string;
  greenland_visited_count: string;
  highland_visited_count: string;
  ocean_visited_count: string;
  rainforest_visited_count: string;
  snow_visited_count: string;
  swamp_visited_count: string;
  objects_placed_count: string;
  [objectPlaced: string]: string;
}
