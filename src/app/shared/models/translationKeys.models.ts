export interface ITranslationKeys {
  TROPHIES: ITrophiesTranslationKeys;
  UI: IUITranslationKeys;
}

export interface ITrophiesTranslationKeys {
  play_games_counter: string;
  visit_all_biomes: string;
  visit_all_biomes_counter: string;
  going_underwater: string;
  going_underwater_counter: string;
  place_all_objects: string;
  place_object: string;
  place_objects_counter: string;
  travelled_distance_counter: string;
  repulse_fishes: string;
  repulse_butterflies: string;
  find_captain_treasure: string;
  add_carrot_snowmnan: string;
  going_under_rain: string;
  go_in_sun: string;
  unlock_trophy_percentage: string;
}

export interface IUITranslationKeys {
  trophies: string;
  online_count: string;
  trophy_unlocked: string;
  home: {
    title: string;
    subtitle: string;
    debug: string;
    form: {
      seed: string;
      seed_placeholder: string;
      graphics: string;
      high_quality_option: string;
      medium_quality_option: string;
      low_quality_option: string;
      gamemode: string;
      singleplayer_option: string;
      multiplayer_option: string;
      soundmode: string;
      sound_on_option: string;
      sound_off_option: string;
      start_btn: string;
    }
  };
}
