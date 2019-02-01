import React from 'react';

import { progressionSvc } from '@achievements/services/progression.service';
import { translationSvc } from '@shared/services/translation.service';

import { IProgressionWithCount } from '@achievements/models/progression.model';

import './progress.styles';

interface IProgressState {
  progression: IProgressionWithCount[];
}

interface IProgressProps {

}

class Progress extends React.Component<IProgressProps, IProgressState> {

  state = {
    progression: progressionSvc.getProgressionShown()
  };

  render() {
    return (
      <ul className='tab tab--progress'>
        <h3 className='title mb-3'>Progression</h3>
        {this.state.progression.map((item: IProgressionWithCount, index: number) => (
          <li className='p-2 pt-1 pb-1' key={index}>
            {translationSvc.translate(`UI.progression.${item.name}`, { count: item.count })}
          </li>
        ))}
      </ul>
    );
  }

}

export default Progress;
