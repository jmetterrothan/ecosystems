import React from 'react';

import UIState from '@ui/UIState';

class UIGameState extends UIState {
  init() {
    console.info('INIT GAME');
  }

  render() {
    return <div className="ui-state">
      game
    </div>;
  }
}

export default UIGameState;
