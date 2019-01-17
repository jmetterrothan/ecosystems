import React from 'react';

import Main from '@app/Main';
import UIState from '@ui/UIState';

import Loading from '@templates/Loading/loading';
import { UI_STATES } from '../enums/UIStates.enum';

class UILoadingState extends UIState {

  init() {
    console.log('INIT LOADING');
  }

  async process() {
    const { parameters } = this.uiManager.state;

    const app = new Main();
    await app.init(this.uiManager);
    const seed = await app.load(parameters.seed);
    app.run();

    this.uiManager.switchState(UI_STATES.GAME, { seed });
  }

  render() {
    return Loading;
  }

}

export default UILoadingState;
