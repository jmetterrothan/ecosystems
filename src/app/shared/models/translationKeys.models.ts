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
  remove_object: string;
  remove_objects_counter: string;
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
  play_online: string;
  place_object_online: string;
  place_object_voice: string;
  place_all_mushrooms: string;
  place_all_flowers: string;
  woodcutter: string;
  mushrooms_soup: string;
  bunch_of_flowers: string;
  under_map: string;
  weird_mushroom: string;
}

export interface IUITranslationKeys {
  online: {
    room_joined: string;
    count: string;
    system_messages: {
      connection: string;
      disconnection: string;
    }
  };
  trophy_unlocked: string;
  biomes: {
    desert: string;
    desert_island: string;
    fjords: string;
    highlands: string;
    ocean: string;
    rainforest: string;
    snowy_hills: string;
    swamps: string;
    taiga: string;
  };
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
    tab1: {
      reset_btn: string;
      intro: string;
      title_commands: string;
      subtitle_keyboard: string;
      subtitle_mouse: string;
      actionkey: {
        down: string;
        up: string;
        right: string;
        left: string;
        back: string;
        front: string;
        vocal: string;
        reload: string;
        mute: string;
        menu: string;
        freeze: string;
        chat: string;
      };
      'mouse_left-click': string;
      'mouse_left-click_name': string;
      'mouse_right-click': string;
      'mouse_right-click_name': string;
      mouse_scroll: string;
      mouse_scroll_name: string;
    };
    tab2: {
      intro: string;
      subtitle: string;
      subtitle_a1: string;
      subtitle_a2: string;
      subtitle_a3: string;
      subtitle_a4: string;
      subtitle_a5: string;
      text_a1: string;
      text_a2: string;
      text_a3: string;
      text_a4: string;
      text_a5: string;
    };
  };
  'home-tab': {
    title: string;
    article: {
      title_project: string;
      title_objectives: string;
      title_help: string;
      title_tech: string;
      title_code: string;
      p1: string;
      p2: string;
      p3: string;
      p4: string;
      p5: string;
      p6: string;
      p7: string;
      p8: string;
    };
    share: {
      text: string;
    };
  };
  'credits-tab': {
    title: string;
    description_jeremie: string;
    description_florian: string;
    description_lucas: string;
    description_jordan: string;
    description_christina: string;
    description_ugo: string;
  };
  'progress-tab': {
    title: string;
    title_stats: string;
    title_biomes: string;
    game_played: string;
    distance_travelled: string;
    going_underwater: string;
    objects_placed: string;
    unlock_trophies_percentage: string;
    objects_placed_submarine: string;
    objects_placed_voice: string;
    objects_removed: string;
    play_online: string;
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
    };
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
