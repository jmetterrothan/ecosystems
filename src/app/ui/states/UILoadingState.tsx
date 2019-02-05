import React from 'react';

import Main from '@app/Main';
import UIManager from '@ui/UIManager';
import { IUIState } from '@ui/models/UIState';

import Loading from '@templates/loading/loading';

import { UIStates } from '@ui/enums/UIStates.enum';
import { monitoringSvc } from '@app/shared/services/monitoring.service';

class UILoadingState extends React.PureComponent implements IUIState {
  init() {
    console.log('INIT LOADING');
  }

  async process(uiManager: UIManager) {
    const { parameters } = uiManager.state;

    const app = new Main();
    await app.init();
    const seed = await app.load(parameters.seed, parameters.online);

    monitoringSvc.sendEvent(monitoringSvc.categories.game, monitoringSvc.actions.played, seed);

    app.run();

    uiManager.switchState(UIStates.MENU, { seed });
  }

  render() {
    return Loading;
  }
}

export default UILoadingState;
