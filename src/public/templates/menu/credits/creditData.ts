export enum Icons {
  Portfolio = 'sphere',
  Github = 'github',
  LinkedIn = 'linkedin',
  StackOverflow = 'stackoverflow',
  Email = 'mail2',
  Twitter = 'twitter'
}

export interface ICollaboratorLink {
  url: string;
  icon: string;
}

export interface ICollaboratorProps {
  fullname: string;
  description?: string;
  links?: ICollaboratorLink[];
}

export const collaborators: ICollaboratorProps[] = [
  {
    fullname: 'Jérémie Metter-Rothan',
    description: 'Chef de projet, développeur - three.js / React.',
    links: [
      { url: 'https://jeremie.metter-rothan.fr', icon: Icons.Portfolio },
      { url: 'https://github.com/jmetterrothan', icon: Icons.Github },
      { url: 'https://www.linkedin.com/in/jeremie-metter-rothan', icon: Icons.LinkedIn },
      { url: 'mailto:jeremie@metter-rothan.fr', icon: Icons.Email }
    ]
  },
  {
    fullname: 'Florian Zobèle',
    description: 'Développeur - three.js / React / socket.io.',
    links: [
      { url: 'https://florianzobele.fr', icon: Icons.Portfolio },
      { url: 'https://github.com/Ghuntheur', icon: Icons.Github },
      { url: 'https://www.linkedin.com/in/florianzobele', icon: Icons.LinkedIn },
      { url: 'https://stackoverflow.com/users/9239242/ghuntheur', icon: Icons.StackOverflow },
      { url: 'mailto:hello@florianzobele.fr', icon: Icons.Email }
    ]
  },
  {
    fullname: 'Lucas Dussouchaud',
    description: 'Développeur gameplay - commandes vocales avec tensorflow.',
    links: [
      { url: 'http://noisiv.fr', icon: Icons.Portfolio },
      { url: 'https://www.linkedin.com/in/lucas-dussouchaud-67b492166/', icon: Icons.LinkedIn }
    ]
  },
  {
    fullname: 'Jordan Vilsaint',
    description: 'Développeur - sons et ambiences sonores.',
    links: [
      { url: 'http://jovsn.alwaysdata.net', icon: Icons.Portfolio },
      { url: 'https://github.com/jovsn', icon: Icons.Github },
      { url: 'https://linkedin.com/in/jordan-v-7b7734b0', icon: Icons.LinkedIn },
    ]
  },
  {
    fullname: 'Christina Schinzel',
    description: 'UX/UI Designer.',
    links: [
      { url: 'http://www.christinaschinzel.com', icon: Icons.Portfolio },
      { url: 'https://www.linkedin.com/in/christina-schinzel', icon: Icons.LinkedIn },
    ]
  }
];
