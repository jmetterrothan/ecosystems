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
    description: 'UI.credits-tab.description_jeremie',
    links: [
      { url: 'https://jeremie.metter-rothan.fr', icon: Icons.Portfolio },
      { url: 'https://github.com/jmetterrothan', icon: Icons.Github },
      { url: 'https://www.linkedin.com/in/jeremie-metter-rothan', icon: Icons.LinkedIn },
      { url: 'mailto:jeremie@metter-rothan.fr', icon: Icons.Email }
    ]
  },
  {
    fullname: 'Florian Zobèle',
    description: 'UI.credits-tab.description_florian',
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
    description: 'UI.credits-tab.description_lucas',
    links: [
      { url: 'http://noisiv.fr', icon: Icons.Portfolio },
      { url: 'https://www.linkedin.com/in/lucas-dussouchaud-67b492166/', icon: Icons.LinkedIn }
    ]
  },
  {
    fullname: 'Jordan Vilsaint',
    description: 'UI.credits-tab.description_jordan',
    links: [
      { url: 'http://jovsn.alwaysdata.net', icon: Icons.Portfolio },
      { url: 'https://github.com/jovsn', icon: Icons.Github },
      { url: 'https://linkedin.com/in/jordan-v-7b7734b0', icon: Icons.LinkedIn },
    ]
  },
  {
    fullname: 'Christina Schinzel',
    description: 'UI.credits-tab.description_christina',
    links: [
      { url: 'http://www.christinaschinzel.com', icon: Icons.Portfolio },
      { url: 'https://www.linkedin.com/in/christina-schinzel', icon: Icons.LinkedIn },
    ]
  }
];
