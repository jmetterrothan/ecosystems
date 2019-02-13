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
      { url: 'mailto:jeremie@metter-rothan.fr', icon: Icons.Email },
      { url: 'https://github.com/jmetterrothan', icon: Icons.Github },
      { url: 'https://jeremie.metter-rothan.fr', icon: Icons.Portfolio },
      { url: 'https://www.linkedin.com/in/jeremie-metter-rothan', icon: Icons.LinkedIn },
    ]
  },
  {
    fullname: 'Florian Zobèle',
    description: 'UI.credits-tab.description_florian',
    links: [
      { url: 'https://bit.ly/2N4sFlB', icon: Icons.StackOverflow },
      { url: 'mailto:hello@florianzobele.fr', icon: Icons.Email },
      { url: 'https://bit.ly/2E9dqFo', icon: Icons.Github },
      { url: 'https://bit.ly/2Sz5LZT', icon: Icons.Portfolio },
      { url: 'https://www.linkedin.com/in/florianzobele', icon: Icons.LinkedIn },
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
      { url: 'https://github.com/jovsn', icon: Icons.Github },
      { url: 'http://jovsn.alwaysdata.net', icon: Icons.Portfolio },
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
  },
  {
    fullname: 'Ugo Bouveron',
    description: 'UI.credits-tab.description_ugo',
    links: [
      { url: 'https://twitter.com/ubouveron', icon: Icons.Twitter },
      { url: 'https://www.ugobouveron.com/', icon: Icons.Portfolio },
      { url: 'https://www.linkedin.com/in/ugobouveron', icon: Icons.LinkedIn },
    ]
  }
];
