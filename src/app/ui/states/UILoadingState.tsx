import React from 'react';

import Main from '@app/Main';
import UIState from '@ui/UIState';

import Loading from '@templates/Loading/loading';
import { UI_STATES } from '../enums/UIStates.enum';
import UIManager from '../UIManager';

class UILoadingState extends UIState {
  init() {
    console.log('INIT LOADING');
  }

  async process(uiManager: UIManager) {
    const { parameters } = uiManager.state;

    const app = new Main();
    await app.init(uiManager);
    const seed = await app.load(parameters.seed);
    app.run();

    uiManager.switchState(UI_STATES.GAME, { seed });
  }

  render() {
    return Loading;
  }

}

export default UILoadingState;
