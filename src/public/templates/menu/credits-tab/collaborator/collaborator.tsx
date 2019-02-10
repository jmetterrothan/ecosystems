import React from 'react';
import classNames from 'classnames';

import { ICollaboratorProps } from '../data/data';
import { translationSvc } from '@app/shared/services/translation.service';

import './collaborator.styles';

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
        <p className='collaborator__description'>{translationSvc.translate(description)}</p>
      </div>
    );
  }
}

export default Collaborator;
