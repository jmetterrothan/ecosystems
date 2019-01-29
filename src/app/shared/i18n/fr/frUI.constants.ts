import { IUITranslationKeys } from '@shared/models/translationKeys.models';

export const FR_UI_TRANSLATION: IUITranslationKeys = {
  trophies: 'La page des trophées',
  online_count: 'En ligne {{count}}',
  trophy_unlocked: 'Trophée débloqué',
  home: {
    title: 'Ecosystems',
    subtitle: 'Une expérience 3d interactive',
    debug: 'Debug',
    form: {
      seed: 'Choisir une graine',
      seed_placeholder: '',
      graphics: 'Options graphiques',
      high_quality_option: 'Élevé',
      medium_quality_option: 'Moyen',
      low_quality_option: 'Faible',
      gamemode: 'Mode de jeu',
      singleplayer_option: 'Local',
      multiplayer_option: 'En ligne',
      soundmode: 'Son',
      sound_on_option: 'Activé',
      sound_off_option: 'Désactivé',
      start_btn: 'Lancer'
    }
  },
  progression: {
    game_played: 'Parties jouées: {{count}}',
    distance_travelled: 'Distance parcourue : {{count}}',
    going_underwater: 'Nombre de fois sous l\'eau : {{count}}',
    objects_placed: 'Objets placés : {{count}}',
    unlock_trophies_percentage: 'Trophées débloqués : {{count}}%'
  },
  cookies: {
    more: 'Voir plus',
    decline: 'Refuser',
    allow: 'Accepter',
    message: 'En poursuivant votre navigation, vous acceptez l’utilisation de cookies d\'analyse d\'audience et de fréquentation.'
  }
};
