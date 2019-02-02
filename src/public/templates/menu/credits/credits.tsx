import React from 'react';

import { collaborators } from './data/data';

import Collaborator from './collaborator/collaborator';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';

import { translationSvc } from '@app/shared/services/translation.service';

import './credits.styles';

class Credits extends React.Component {
  render() {
    return (
      <div className='tab tab--credits'>
        <H3 className='title color-theme mb-3'>{translationSvc.translate('UI.credits.title')}</H3>
        <ul className='credits-tab__collaborators'>
          {collaborators.map((collaborator, i) => <li key={i}><Collaborator {...collaborator} /></li>)}
        </ul>
      </div>
    );
  }
}

export default Credits;
