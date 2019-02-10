import React from 'react';

import { translationSvc } from '@app/shared/services/translation.service';

import './loader.styles.scss';

const Loader = () => (
  <div className='loader'>
    <p className='loader__text mb-2'>{translationSvc.translate('UI.home.loading')}</p>
    <ul className='loader__animation'>
      <li />
      <li />
      <li />
    </ul>
  </div>
);

export default Loader;
