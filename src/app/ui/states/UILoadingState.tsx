import React from 'react';

import Main from '@app/Main';
import UIManager from '@ui/UIManager';
import UIState from '@ui/UIState';

import Loading from '@templates/Loading/loading';

import { UI_STATES } from '@ui/enums/UIStates.enum';

class UILoadingState extends UIState {
  init() {
    console.log('INIT LOADING');
  }

  async process(uiManager: UIManager) {
    const { parameters } = uiManager.state;

    const app = new Main();
    await app.init(uiManager);
    await app.load(parameters.seed, parameters.online);
    app.run();

    uiManager.switchState(UI_STATES.MENU, { tab: 0 });
  }

  render() {
    return Loading;
  }

}

export default UILoadingState;
