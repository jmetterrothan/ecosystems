import React from 'react';
import classNames from 'classnames';

import CommonUtils from '@app/shared/utils/Common.utils';

import { ITrophy } from '@achievements/models/trophy.model';

import { translationSvc } from '@shared/services/translation.service';

import './trophy.styles.scss';

const Trophy: React.SFC<ITrophy> = ({ name, Icon, difficulty, unlocked }) => {
  const unlockedClass = unlocked ? 'trophy--unlocked' : null;
  const difficultyClass = `trophy--difficulty-${difficulty}`;

  if (name.options && name.options.counter) {
    name.options.counter =  CommonUtils.formatNumberWithSpaces(name.options.counter);
  }

  return (
    <div className={classNames('trophy', unlockedClass, difficultyClass)}>
      <div className='trophy__icon mb-1'>
        {Icon && <Icon />}
        <span className='trophy__pastille'>{difficulty + 1}</span>
      </div>
      <h4 className='trophy__name'>{translationSvc.translate(name.key, name.options)}</h4>
    </div>
  );
};

export default Trophy;
