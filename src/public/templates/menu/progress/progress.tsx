import React from 'react';

import CommonUtils from '@app/shared/utils/Common.utils';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';

import { progressionSvc } from '@achievements/services/progression.service';
import { translationSvc } from '@shared/services/translation.service';

import { IProgressionWithCount } from '@achievements/models/progression.model';

import './progress.styles';

interface IProgressState {
  progression: IProgressionWithCount[];
}

class Progress extends React.Component<any, IProgressState> {
  state = {
    progression: progressionSvc.getProgressionShown()
  };

  render() {
    return (
      <ul className='tab tab--progress'>
        <H3 className='title color-theme mb-2'>{translationSvc.translate('UI.progression.title')}</H3>
        {this.state.progression.map((item: IProgressionWithCount, index: number) => (
          <li className='p-2 pt-1 pb-1' key={index}>
            {translationSvc.translate(`UI.progression.${item.name}`, { count: CommonUtils.formatNumberWithSpaces(item.count) })}
          </li>
        ))}
      </ul>
    );
  }
}

export default Progress;
