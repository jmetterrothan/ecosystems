import React from 'react';

import UIManager from '@ui/UIManager';
import { IUIState } from '@ui/models/UIState';

import Menu from '@templates/menu/menu';

class UIMenuState extends React.PureComponent implements IUIState {

  init() {
    console.info('INIT MENU');
  }

  process(uiManager: UIManager) { }

  render() {
    return Menu;
  }
}

export default UIMenuState;
