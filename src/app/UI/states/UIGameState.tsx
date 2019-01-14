import React from 'react';

import UIState from '@ui/UIState';

class UIGameState extends UIState {
  init() {
    console.info('INIT GAME');
  }

  render() {
    return <>
      <h1>game</h1>
    </>;
  }
}

export default UIGameState;
