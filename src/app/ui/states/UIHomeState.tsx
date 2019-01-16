import React from 'react';

import Home from '@templates/Home/home';

import UIState from '@ui/UIState';

class UIHomeState extends UIState {

  init() {
    console.info('INIT HOME');
  }

  process() { }

  render() {
    return Home;
  }
}

export default UIHomeState;
