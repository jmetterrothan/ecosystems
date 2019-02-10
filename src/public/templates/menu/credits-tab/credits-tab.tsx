import React from 'react';

import { collaborators } from './data/data';

import Collaborator from './collaborator/collaborator';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';

import { translationSvc } from '@app/shared/services/translation.service';

import './credits-tab.styles';

class CreditsTab extends React.Component {
  render() {
    return (
      <div className='tab credits-tab'>
        <header className='tab__header'>
          <H3 className='title color-theme mb-2'>{translationSvc.translate('UI.credits-tab.title')}</H3>
        </header>
        <div className='tab__content'>
          <ul className='credits-tab__collaborators'>
            {collaborators.map((collaborator, i) => <li key={i}><Collaborator {...collaborator} /></li>)}
          </ul>
        </div>
      </div>
    );
  }
}

export default CreditsTab;
