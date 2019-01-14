import React from 'react';

import Game from '@templates/Game/game';

import UIState from '@ui/UIState';
import withService from '@public/components/withService/withService';

class UIGameState extends UIState {
  init() {
    console.info('INIT GAME');
  }

  render() {
    return (
      withService(Game)({ uiManager: this.uiManager })
    );
  }
}

export default UIGameState;
