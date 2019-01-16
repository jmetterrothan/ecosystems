import React from 'react';

import UIState from '@ui/UIState';

class UIGameState extends UIState {
  init() {
    console.info('INIT GAME');
  }

  process() { }

  render() {
    return <div />;
  }
}

export default UIGameState;
