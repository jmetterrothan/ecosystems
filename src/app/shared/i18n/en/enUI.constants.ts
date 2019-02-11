import { IUITranslationKeys } from '@shared/models/translationKeys.models';

export const EN_UI_TRANSLATION: IUITranslationKeys = {
  menu: {
    new_world_btn: 'New world',
    continue_btn: 'Continue',
  },
  biomes: {
    desert: 'Desert',
    desert_island: 'Desert Island',
    fjords: 'Fjords',
    highlands: 'Highlands',
    ocean: 'Ocean',
    rainforest: 'Rainforest',
    snowy_hills: 'Snowy Hills',
    swamps: 'Swamps',
  },
  online_count: 'Online {{count}}',
  trophy_unlocked: 'Trophy unlocked',
  home: {
    title: 'Ecosystems',
    subtitle: 'A 3d interactive experience',
    debug: 'Debug',
    loading: 'Loading',
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
      start_btn: 'Start',
      seed_tooltip_title: 'What\'s a seed ?',
      seed_tooltip_text: 'The seed can either be a number, a word or a phrase. It\'s used to generate a unique world.',
    }
  },
  'trophies-tab': {
    title: 'Trophies',
    sort_by_type: 'Sort by type',
    sort_by_completion_status: 'Sort by completion status',
    sort_by_difficulty: 'Sort by difficulty',
    reset_title: 'Reset your progression',
    reset_text: 'Your progression will be completely erased. You can start from scratch but you cannot go back.',
    reset_btn: 'Reset'
  },
  'tutorial-tab': {
    title: 'Help',
    tab1: {
      reset_btn: 'Reset',
      intro: 'You can modify some of the key bindings by clicking on the associated button then on the desired key on your keyboard.',
      title_commands: 'Keys',
      subtitle_keyboard: 'Keyboard',
      subtitle_mouse: 'Mouse',
      actionkey: {
        down: 'Descend',
        up: 'Ascend',
        right: 'Right',
        left: 'Left',
        back: 'Backwards',
        front: 'Forwards',
        vocal: 'Enable/Disable vocal commands',
        reload: 'Generate a new world',
        mute: 'Enable/Disable sound',
        menu: 'Menu',
      },
      'mouse_left-click': 'Put an object down',
      'mouse_left-click_name': 'Left click',
      'mouse_right-click': 'Delete an object',
      'mouse_right-click_name': 'Right click',
      mouse_scroll: 'Changer current object',
      mouse_scroll_name: 'Scroll',
    },
    tab2: {
      intro: 'You can place objects using your voice. Don\'t forget to give the application access to your microphone.',
      subtitle: 'Place an object with your voice',
      text: '...'
    }
  },
  'home-tab': {
    title: 'Ecosystems',
    article: {
      title_project: 'The project',
      title_tech: 'The technologies used',
      p1: 'Ecosystems is a project developed by 3rd year IMAC students in the Artificial Intelligence course. The purpose of the project is to experience a 3d interactive world in a web browser.',
      p2: 'You can reload the page anytime you want or click the "New world" button to generate a brand new and unique world. There is a total of {{count}} different biomes to discover.',
      p3: 'Unlock all {{count}} trophies by roaming and searching the worlds.',
      p4: 'The project uses three.js for the rendering, React for the user interface, and tensorflow for voice commands recognition. Some functionalities are still in development and prone to bugs.',
      p5: 'Use a desktop version of Chrome or Firefox for an optimal experience.'
    }
  },
  'credits-tab': {
    title: 'Credits',
    description_jeremie: 'Project manager, developer - three.js / React.',
    description_florian: 'Developer - three.js / React / socket.io.',
    description_lucas: 'Gameplay developer - vocal commands with tensorflow.',
    description_jordan: 'Developer - sounds.',
    description_christina: 'UX/UI Designer.',
    description_ugo: 'Tester.'
  },
  'progress-tab': {
    title: 'Progression',
    game_played: 'Game played : {{count}}',
    distance_travelled: 'Distance travelled : {{count}} miles',
    going_underwater: 'Underwater : {{count}}',
    objects_placed: 'Objects placed : {{count}}',
    objects_placed_submarine: 'Objects placed underwater : {{count}}',
    unlock_trophies_percentage: 'Trophies unlocked : {{count}}%',
  },
  'contact-tab': {
    title: 'Contact',
    header: 'A problem, a question or some feedback ? You can contact us with the form below. We will try to answer as quickly as possible.',
    email: 'Email',
    subject: 'Subject',
    select: {
      bug: 'Bug',
      improvement: 'Improvement',
      other: 'Other'
    },
    message: 'Message',
    send: 'Send'
  },
  cookies: {
    more: 'Learn more',
    decline: 'Decline',
    allow: 'Allow cookies',
    message: 'We use cookies to measure how visitors interact with the website.'
  }
};
