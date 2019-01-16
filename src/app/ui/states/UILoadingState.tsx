import React from 'react';

import Main from '@app/Main';
import UIState from '@ui/UIState';

import Loading from '@templates/Loading/loading';
import { UI_STATES } from '../enums/UIStates.enum';

class UILoadingState extends UIState {

  init() {
    console.log('init loading');
  }

  async process() {
    const app = new Main();
    await app.init();
    const seed = await app.load();
    app.run();

    console.log('ok');

    this.uiManager.switchState(UI_STATES.GAME);
  }

  render() {
    return Loading;
  }

}

export default UILoadingState;
