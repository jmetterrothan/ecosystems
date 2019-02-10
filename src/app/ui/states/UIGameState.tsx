import React from 'react';

import Game from '@templates/game/game';
import UIManager from '@ui/UIManager';

import { IUIState } from '@ui/models/UIState';

class UIGameState extends React.PureComponent implements IUIState {
  init() { }

  process(uiManager: UIManager) { }

  render() {
    return Game;
  }
}

export default UIGameState;
