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
    taiga: 'Taïga'
  },
  online: {
    count: 'En ligne : {{count}}',
    room_joined: 'Nouvel utilisateur connecté',
    system_messages: {
      connection: '{{user}} s’est connecté',
      disconnection: '{{user}} s’est déconnecté'
    }
  },
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
      seed_tooltip_title: 'Qu’est ce qu’une seed ?',
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
    tab1: {
      reset_btn: 'Réinitialiser',
      intro: 'Vous pouvez modifier certaines commandes en cliquant sur le bouton associé puis en appuyant sur la touche souhaitée.',
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
        vocal: 'Maintenir pour Activer/Désactiver la voix',
        reload: 'Générer un nouveau monde',
        mute: 'Activer/Désactiver le son',
        menu: 'Retour au menu',
        freeze: 'Figer le temps',
        chat: 'Ouvrir / Fermer le chat'
      },
      'mouse_left-click': 'Poser un objet',
      'mouse_left-click_name': 'Clic gauche',
      'mouse_right-click': 'Supprimer un objet',
      'mouse_right-click_name': 'Clic droit',
      mouse_scroll: 'Changer d’objet',
      mouse_scroll_name: 'Scroll',
    },
    tab2: {
      intro: 'Vous pouvez utiliser votre voix pour réaliser certaines actions en maintenant la touche “V” (par défaut) enfoncée. Les commandes vocales sont à prononcer en anglais. Veillez à ce que l’application puisse accéder à votre microphone.',
      subtitle: 'Commandes vocales',
      subtitle_a1: 'Placer un objet',
      subtitle_a2: 'Supprimer un objet',
      subtitle_a3: 'Changer le temps',
      subtitle_a4: 'Changer l’objet sélectionné',
      subtitle_a5: 'Figer le temps',
      text_a1: 'Pour placer un objet, vous devez vous mettre à bonne distance du sol, un curseur vert devrait apparaître au centre de l’écran si c’est le cas et dites distinctement "place".',
      text_a2: 'Pour supprimer un objet, une fois placé à bonne distance, un curseur orange devrait apparaître au centre de l’écran et dites distinctement "void".',
      text_a3: 'Pour changer l’heure en jeu, dites distinctement "night" ou "day".',
      text_a4: 'Pour cycler dans les objets disponibles, dites distinctement "next".',
      text_a5: 'Pour figer le temps, dites distinctement "freeze".'
    }
  },
  'home-tab': {
    title: 'Ecosystems',
    seed: 'Seed utilisée pour générer le monde',
    article: {
      title_project: 'Notre projet',
      title_objectives: 'Débloquer les trophées',
      title_help: 'En cas de problème …',
      title_tech: 'Les technologies utilisées',
      title_code: 'Code source',
      p1: 'Ecosystems est un projet visant à générer aléatoirement des mondes 3D interactifs. Ces mondes constituent un canevas ayant servis à intégrer divers algorithmes vus dans le cadre du cours d’Intelligence Artificielle de 3ème à l’IMAC.',
      p2: 'Vous pouvez débloquer au total {{trophyCount}} trophées en fouillant les {{biomeCount}} différents biomes et en réalisant des actions spécifiques. Vous avez la possibilité de suivre votre progression dans les onglets dédiés. Chaque monde généré est unique et identifié par une seed. Pour découvrir une nouvelle génération vous pouvez simplement recharger la page ou appuyer sur le bouton “Nouveau monde”. Un mode multijoueur est aussi disponible pour découvrir les mondes à plusieurs.',
      p3: 'L’onglet tutoriel liste les touches et commandes vocales utilisables, vous pouvez également les changer en cas de besoin. Il est fortement conseillé d’utiliser une version PC de Chrome pour une expérience optimale.',
      p4: 'L’application a été développée avec Typescript.',
      p5: 'Monde 3D :',
      p6: 'Interface :',
      p7: 'Multijoueur :',
      p8: 'Reconnaissance vocale :'
    },
    share: {
      text: 'Vous pouvez partagez la session actuelle en envoyant le lien suivant :'
    }
  },
  'credits-tab': {
    title: 'Crédits',
    description_jeremie: 'Chef de projet, développeur - three.js / React.',
    description_florian: 'Développeur - three.js / React / socket.io.',
    description_lucas: 'Développeur gameplay - commandes vocales avec tensorflow.',
    description_jordan: 'Développeur - sons et ambiances sonores.',
    description_christina: 'UX/UI Designer.',
    description_ugo: 'Testeur.'
  },
  'progress-tab': {
    title: 'Progression',
    title_stats: 'Statistiques',
    title_biomes: 'Biomes visités',
    game_played: 'Parties jouées : {{count}}',
    distance_travelled: 'Distance parcourue : {{count}} km',
    going_underwater: 'Nombre de fois sous l’eau : {{count}}',
    objects_placed: 'Objets placés : {{count}}',
    objects_placed_submarine: 'Objets placés sous l’eau : {{count}}',
    objects_placed_voice: 'Objets placés à la voix : {{count}}',
    objects_removed: 'Objects supprimés : {{count}}',
    unlock_trophies_percentage: 'Trophées débloqués : {{count}}%',
    play_online: 'Parties jouées en ligne : {{count}}',
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
    message: 'En poursuivant votre navigation, vous acceptez l’utilisation de cookies d’analyse d’audience et de fréquentation.'
  }
};
