import React from 'react';

import UIState from '@ui/UIState';

import Game from '@templates/Game/game';

class UILoadingState extends UIState {

  init() {

  }

  process() {
  }

  render() {
    return Game;
  }

}

export default UILoadingState;
