import React from 'react';

import Home from '@templates/home/home';
import UIManager from '@ui/UIManager';

import { IUIState } from '@ui/models/UIState';

class UIHomeState extends React.PureComponent implements IUIState {
  init() {
    console.info('INIT HOME');
  }

  process(uiManager: UIManager) { }

  render() {
    return Home;
  }
}

export default UIHomeState;
