import { IUITranslationKeys } from '@shared/models/translationKeys.models';

export const EN_UI_TRANSLATION: IUITranslationKeys = {
  trophies: 'Trophies page',
  online_count: 'Online {{count}}',
  trophy_unlocked: 'Trophy unlocked',
  home: {
    title: 'Ecosystems',
    subtitle: 'A 3d interactive experience',
    debug: 'Debug',
    form: {
      seed: 'Choose a seed',
      seed_placeholder: '',
      graphics: 'Graphics',
      high_quality_option: 'High',
      medium_quality_option: 'Medium',
      low_quality_option: 'Low',
      gamemode: 'Game mode',
      singleplayer_option: 'Singleplayer',
      multiplayer_option: 'Multiplayer',
      soundmode: 'Sound',
      sound_on_option: 'ON',
      sound_off_option: 'OFF',
      start_btn: 'Start'
    }
  },
  progression: {
    game_played: 'Game played : {{count}}',
    distance_travelled: 'Distance travelled : {{count}}',
    going_underwater: 'Underwater : {{count}}',
    objects_placed: 'Objects placed : {{count}}',
    unlock_trophies_percentage: 'Trophies unlocked : {{count}}%'
  },
  cookies: {
    more: 'Learn more',
    decline: 'Decline',
    allow: 'Allow cookies',
    message: 'We use cookies to measure how visitors interact with the website.'
  }
};
