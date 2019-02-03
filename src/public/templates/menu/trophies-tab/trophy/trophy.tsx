import React from 'react';
import classNames from 'classnames';

import { ITrophy } from '@achievements/models/trophy.model';

import { translationSvc } from '@shared/services/translation.service';

import './trophy.styles.scss';

const Trophy: React.SFC<ITrophy> = ({ name, difficulty, unlocked }) => {
  const unlockedClass = unlocked ? 'trophy--unlocked' : null;
  const difficultyClass = `trophy--difficulty-${difficulty}`;

  return (
    <div className={classNames('trophy', unlockedClass, difficultyClass)}>
      <div className='trophy__icon mb-1'>
        <span className='icon-trophy' />
        <span className='trophy__pastille'>{difficulty + 1}</span>
      </div>
      <h4 className='trophy__name'>{translationSvc.translate(name.key, name.options)}</h4>
    </div>
  );
};

export default Trophy;
