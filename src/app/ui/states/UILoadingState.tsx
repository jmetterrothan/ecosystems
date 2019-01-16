import React from 'react';

import Main from '@app/Main';
import { IUIState } from '@ui/models/uiState.model';

import Loading from '@templates/Loading/loading';

class UILoadingState extends React.Component implements IUIState {

  init() {

  }

  async process() {
    const app = new Main();
    await app.init();
    const seed = await app.load();
    app.run();
  }

  render() {
    return Loading;
  }

}

export default UILoadingState;
