import React from 'react';
import classNames from 'classnames';

import { Icons, ICollaboratorLink, ICollaboratorProps, collaborators } from './creditData';

import './credits.styles';

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
        <h3 className='title mb-3'>Crédits</h3>
        <ul className='credits-tab__collaborators'>
          {collaborators.map((collaborator, i) => <li key={i}><Collaborator {...collaborator} /></li>)}
        </ul>
      </div>
    );
  }
}

export default Credits;
