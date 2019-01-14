import React from 'react';

import UIState from '@ui/UIState';

class UIHomeState extends UIState {
  init() {
    console.info('INIT HOME');
  }

  render() {
    return <>
      <h1>home</h1>
    </>;
  }
}

export default UIHomeState;
