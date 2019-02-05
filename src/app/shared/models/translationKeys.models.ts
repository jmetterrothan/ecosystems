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
  place_object_submarine: string;
  place_objects_counter: string;
  travelled_distance_counter: string;
  repulse_fishes: string;
  repulse_butterflies: string;
  find_captain_treasure: string;
  find_scarecrow: string;
  add_carrot_snowmnan: string;
  archaeology: string;
  going_under_rain: string;
  go_in_sun: string;
  go_in_moon: string;
  unlock_trophy_percentage: string;
  create_game_online: string;
  join_game_online: string;
  place_object_online: string;
  place_all_mushrooms: string;
  place_all_flowers: string;
}

export interface IUITranslationKeys {
  online_count: string;
  trophy_unlocked: string;
  menu: {
    new_world_btn: string;
    continue_btn: string;
  };
  home: {
    title: string;
    subtitle: string;
    debug: string;
    loading: string;
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
      seed_tooltip_title: string;
      seed_tooltip_text: string;
    }
  };
  'trophies-tab': {
    title: string;
    sort_by_type: string;
    sort_by_completion_status: string;
    sort_by_difficulty: string;
    reset_title: string;
    reset_text: string;
    reset_btn: string;
  };
  'tutorial-tab': {
    title: string;
    title_commands: string;
    title_multiplayer: string;
    subtitle_misc: string;
    subtitle_mvt: string;
    key_down: string;
    key_up: string;
    key_right: string;
    key_left: string;
    key_back: string;
    key_front: string;
    key_vocal: string;
    key_reload: string;
    key_mute: string;
    key_menu: string;
    key_menu_name: string;
    mouse_interaction: string;
    mouse_interaction_name: string;
  };
  'home-tab': {
    title: string;
    article: {
      title_project: string;
      title_tech: string;
      p1: string;
      p2: string;
      p3: string;
      p4: string;
      p5: string;
    }
  };
  'credits-tab': {
    title: string;
    description_jeremie: string;
    description_florian: string;
    description_lucas: string;
    description_jordan: string;
    description_christina: string;
  };
  'progress-tab': {
    title: string;
    game_played: string;
    distance_travelled: string;
    going_underwater: string;
    objects_placed: string;
    unlock_trophies_percentage: string;
  };
  'contact-tab': {
    title: string;
    header: string;
    email: string;
    subject: string;
    select: {
      bug: string;
      improvement: string;
      other: string;
    }
    message: string;
    send: string;
  };
  cookies: {
    more: string;
    decline: string;
    allow: string;
    message: string;
  };
}
