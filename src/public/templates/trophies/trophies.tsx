import React from 'react';
import snakecase from 'snake-case';

import { storageSvc } from '@shared/services/storage.service';
import { translationSvc } from '@shared/services/translation.service';
import { achievementSvc } from '@achievements/services/achievement.service';

import { ITrophy } from '@achievements/models/trophy.model';

import { TROPHIES } from '@achievements/constants/trophies.constants';

class Trophies extends React.Component {

  render() {
    const unlockedTrophies = achievementSvc.getUnlockedTrophies();
    console.log(unlockedTrophies);
    return (
      <ul>
        {TROPHIES.map((trophy: ITrophy, index: number) => (
          <li key={index} style={{ color: unlockedTrophies.includes(trophy) ? 'red' : 'black' }}>{translationSvc.translate(trophy.name.key, trophy.name.options)}</li>
        ))}
      </ul>
    );
  }

}

export default Trophies;
