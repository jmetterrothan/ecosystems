import { IUITranslationKeys } from '@shared/models/translationKeys.models';

export const FR_UI_TRANSLATION: IUITranslationKeys = {
  menu: {
    new_world_btn: 'Nouveau monde',
    continue_btn: 'Continuer',
  },
  online_count: 'En ligne {{count}}',
  trophy_unlocked: 'Trophée débloqué',
  home: {
    title: 'Ecosystems',
    subtitle: 'Une expérience 3d interactive',
    debug: 'Debug',
    form: {
      seed: 'Choisir une seed',
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
      start_btn: 'Lancer',
      seed_tooltip_title: 'Qu\'est ce qu\'une seed ?',
      seed_tooltip_text: 'La seed peut être une nombre, un mot ou une phrase. Elle sert à générer aléatoirement un monde unique.',
    }
  },
  trophies: {
    title: 'Trophées'
  },
  tutorial: {
    title: 'Tutoriel',
    title_commands: 'Commandes',
    title_project: 'Le projet',
    title_tech: 'Les technologies utilisées',
    subtitle_misc: 'Divers',
    subtitle_mvt: 'Déplacement',
    key_down: 'Descendre',
    key_up: 'Monter',
    key_right: 'Aller à droite',
    key_left: 'Aller à gauche',
    key_back: 'Reculer',
    key_front: 'Avancer',
    key_vocal: 'Activer/Désactiver les commandes vocales',
    key_reload: 'Générer un nouveau monde',
    key_mute: 'Activer/Désactiver le son',
    key_menu: 'Retour au menu',
    key_menu_name: 'Echap',
    mouse_interaction: 'Interagir',
    mouse_interaction_name: 'Clic droit',
    article: {
      p1: 'Ecosystems est un projet réalisé par des étudiants IMAC dans le cadre du cours d\'Intelligence Artificielle de 3ème année. Le but est de proposer une expérience web interactive dans un monde en 3d.',
      p2: 'Vous pouvez recharger la page ou appuyer sur "Nouveau monde" pour générer aléatoirement un nouveau monde unique. Il y a au total {{count}} types de monde différents à découvrir.',
      p3: 'Débloquer les {{count}} trophées en parcourant et fouillant tous les mondes.',
      p4: 'Le projet utilise three.js pour le rendu, React pour l\'interface, et tensorflow pour pouvoir interagir en parlant avec le monde. Certaines fonctionnalités sont toujours en phase de développement, notamment au niveau de l\'interface et certains éléments de gameplay.',
      p5: 'Utiliser Chome ou Firefox pour une expérience optimale.'
    }
  },
  credits: {
    title: 'Crédits',
    description_jeremie: 'Chef de projet, développeur - three.js / React.',
    description_florian: 'Développeur - three.js / React / socket.io.',
    description_lucas: 'Développeur gameplay - commandes vocales avec tensorflow.',
    description_jordan: 'Développeur - sons et ambiences sonores.',
    description_christina: 'UX/UI Designer.'
  },
  progression: {
    title: 'Progression',
    game_played: 'Parties jouées : {{count}}',
    distance_travelled: 'Distance parcourue : {{count}} m',
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
