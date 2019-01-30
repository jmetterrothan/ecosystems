import React from 'react';
import classNames from 'classnames';

import './credits.styles';

enum Icons {
  Portfolio = 'sphere',
  Github = 'github',
  LinkedIn = 'linkedin',
  StackOverflow = 'stackoverflow',
  Email = 'envelop',
  Twitter = 'twitter'
}

const collaborators: ICollaboratorProps[] = [
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

interface ICollaboratorLink {
  url: string;
  icon: string;
}

interface ICollaboratorProps {
  fullname: string;
  description?: string;
  links?: ICollaboratorLink[];
}

class Collaborator extends React.Component<ICollaboratorProps, any> {
  render() {
    const { fullname, description, links } = this.props;
    return (
      <div className='collaborator mb-3'>
        <div className='collaborator__info mb-1'>
          <h4 className='collaborator__fullname mb-1 mb-0-t mr-2-t'>{fullname}</h4>
          <ul className='collaborator__links'>
            {links.map(({ url, icon }, i) => (<li key={i} className='mr-2'>
              <a target='_blank' href={url} className='collaborator__link'><span className={classNames(`icon-${icon}`)} /></a>
            </li>))}
          </ul>
        </div>
        <p className='collaborator__description'>{description}</p>
      </div>
    );
  }
}

class Credits extends React.Component {
  render() {
    return (
      <div className='tab tab--credits'>
        <ul className='credits-tab__collaborators'>
          {collaborators.map((collaborator, i) => <li key={i}><Collaborator {...collaborator} /></li>)}
        </ul>
      </div>
    );
  }
}

export default Credits;
