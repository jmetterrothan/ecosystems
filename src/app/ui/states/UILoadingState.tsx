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
    const app = new Main();
    await app.init(this.uiManager);
    const seed = await app.load();
    app.run();

    document.body.requestPointerLock();
    this.uiManager.switchState(UI_STATES.GAME, { seed });
  }

  render() {
    return Loading;
  }

}

export default UILoadingState;
