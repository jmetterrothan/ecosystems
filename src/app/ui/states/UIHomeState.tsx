import React from 'react';

import Home from '@templates/Home/home';

import { IUIState } from '@ui/models/uiState.model';

class UIHomeState extends React.Component implements IUIState {

  component = Home;

  init() {
    console.info('INIT HOME');
  }

  process() { }

  render() {
    return Home;
  }
}

export default UIHomeState;
