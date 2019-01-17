import React from 'react';

import Game from '@templates/Game/game';

import UIState from '@ui/UIState';
import UIManager from '@ui/UIManager';

import { UI_STATES } from '../enums/UIStates.enum';

class UIGameState extends UIState {

  init() {

  }

  process() {

  }

  render() {
    return Game;
  }

}

export default UIGameState;
