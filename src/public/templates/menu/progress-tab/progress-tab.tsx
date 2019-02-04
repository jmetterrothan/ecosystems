import React from 'react';

import CommonUtils from '@app/shared/utils/Common.utils';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';

import { progressionSvc } from '@achievements/services/progression.service';
import { translationSvc } from '@shared/services/translation.service';

import { IProgressionWithCount } from '@achievements/models/progression.model';

import './progress-tab.styles';

interface IProgressTabState {
  progression: IProgressionWithCount[];
}

class ProgressTab extends React.Component<any, IProgressTabState> {
  state = {
    progression: progressionSvc.getProgressionShown()
  };

  render() {
    return (
      <ul className='tab progress-tab'>
        <H3 className='title color-theme mb-2'>{translationSvc.translate('UI.progress-tab.title')}</H3>
        {this.state.progression.map((item: IProgressionWithCount, index: number) => (
          <li className='p-2 pt-1 pb-1' key={index}>
            {translationSvc.translate(`UI.progress-tab.${item.name}`, { count: CommonUtils.formatNumberWithSpaces(item.count) })}
          </li>
        ))}
      </ul>
    );
  }
}

export default ProgressTab;
