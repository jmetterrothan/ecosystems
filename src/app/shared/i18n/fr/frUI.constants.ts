import { IUITranslationKeys } from '@shared/models/translationKeys.models';

export const FR_UI_TRANSLATION: IUITranslationKeys = {
  menu: {
    new_world_btn: 'Nouveau monde',
    continue_btn: 'Continuer',
  },
  biomes: {
    desert: 'Désert',
    desert_island: 'Ile déserte',
    fjords: 'Fjords',
    highlands: 'Highlands',
    ocean: 'Océan',
    rainforest: 'Forêt humide',
    snowy_hills: 'Terres enneigées',
    swamps: 'Marais',
  },
  online_count: 'En ligne {{count}}',
  trophy_unlocked: 'Trophée débloqué',
  home: {
    title: 'Ecosystems',
    subtitle: 'Une expérience 3d interactive',
    debug: 'Debug',
    loading: 'Chargement en cours',
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
  'trophies-tab': {
    title: 'Trophées',
    sort_by_type: 'Trier par type',
    sort_by_completion_status: 'Trier par statut',
    sort_by_difficulty: 'Trier par difficulté',
    reset_title: 'Réinitialiser la progression',
    reset_text: 'Vous pouvez réinitialiser les trophées débloqués en cliquant sur le bouton ci-dessous. Attention cette action est irréversible.',
    reset_btn: 'Effacer'
  },
  'tutorial-tab': {
    title: 'Aide',
    reset_btn: 'Réinitialiser',
    howto: 'Vous pouvez modifier certaines commandes en cliquant sur le bouton associé puis en appuyant sur la touche souhaitée.',
    title_commands: 'Commandes',
    subtitle_keyboard: 'Clavier',
    subtitle_mouse: 'Souris',
    actionkey: {
      down: 'Descendre',
      up: 'Monter',
      right: 'Droite',
      left: 'Gauche',
      back: 'Reculer',
      front: 'Avancer',
      vocal: 'Activer/Désactiver les commandes vocales',
      reload: 'Générer un nouveau monde',
      mute: 'Activer/Désactiver le son',
      menu: 'Retour au menu',
    },
    'mouse_left-click': 'Poser un objet',
    'mouse_left-click_name': 'Clic gauche',
    'mouse_right-click': 'Supprimer un objet',
    'mouse_right-click_name': 'Clic droit',
    mouse_scroll: 'Changer d\'objet',
    mouse_scroll_name: 'Scroll',
  },
  'home-tab': {
    title: 'Ecosystems',
    article: {
      title_project: 'Le projet',
      title_tech: 'Les technologies utilisées',
      p1: 'Ecosystems est un projet réalisé par des étudiants IMAC dans le cadre du cours d\'Intelligence Artificielle de 3ème année. Le but est de proposer une expérience web interactive dans un monde en 3d.',
      p2: 'Vous pouvez recharger la page ou appuyer sur "Nouveau monde" pour générer aléatoirement un nouveau monde unique. Il y a au total {{count}} types de biomes différents à découvrir.',
      p3: 'Débloquer les {{count}} trophées en parcourant et fouillant tous les mondes.',
      p4: 'Le projet utilise three.js pour le rendu, React pour l\'interface, et tensorflow pour pouvoir interagir en parlant avec le monde. Certaines fonctionnalités sont toujours en phase de développement, notamment au niveau de l\'interface et certains éléments de gameplay.',
      p5: 'Utiliser une version PC de Chome ou Firefox pour une expérience optimale.'
    }
  },
  'credits-tab': {
    title: 'Crédits',
    description_jeremie: 'Chef de projet, développeur - three.js / React.',
    description_florian: 'Développeur - three.js / React / socket.io.',
    description_lucas: 'Développeur gameplay - commandes vocales avec tensorflow.',
    description_jordan: 'Développeur - sons et ambiances sonores.',
    description_christina: 'UX/UI Designer.',
    description_ugo: 'Testeur' },
  'progress-tab': {
    title: 'Progression',
    game_played: 'Parties jouées : {{count}}',
    distance_travelled: 'Distance parcourue : {{count}} km',
    going_underwater: 'Nombre de fois sous l\'eau : {{count}}',
    objects_placed: 'Objets placés : {{count}}',
    objects_placed_submarine: 'Objets placés sous l\'eau : {{count}}',
    unlock_trophies_percentage: 'Trophées débloqués : {{count}}%',
  },
  'contact-tab': {
    title: 'Contact',
    header: 'Un problème, une question ou une suggestion ? Vous pouvez nous contacter avec le formulaire ci-dessous. Nous vous répondrons dans les plus brefs délais.',
    email: 'Adresse email',
    subject: 'Sujet du message',
    select: {
      bug: 'Signaler un bug',
      improvement: 'Suggérer une amélioration',
      other: 'Autre'
    },
    message: 'Message',
    send: 'Envoyer'
  },
  cookies: {
    more: 'Voir plus',
    decline: 'Refuser',
    allow: 'Accepter',
    message: 'En poursuivant votre navigation, vous acceptez l’utilisation de cookies d\'analyse d\'audience et de fréquentation.'
  }
};
