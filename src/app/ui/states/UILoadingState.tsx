import React from 'react';

import Main from '@app/Main';
import UIManager from '@ui/UIManager';
import { IUIState } from '@ui/models/UIState';

import Loading from '@templates/loading/loading';

import { UIStates } from '@ui/enums/UIStates.enum';

class UILoadingState extends React.PureComponent implements IUIState {
  init() {
    console.log('INIT LOADING');
  }

  async process(uiManager: UIManager) {
    const { parameters } = uiManager.state;

    const app = new Main();
    await app.init(uiManager);
    const seed = await app.load(parameters.seed, parameters.online);
    app.run();

    uiManager.switchState(UIStates.MENU, { seed });
  }

  render() {
    return Loading;
  }
}

export default UILoadingState;
