import React from 'react';

import Home from '@templates/Home/home';

import UIState from '@ui/UIState';
import withService from '@public/components/withService/withService';

class UIHomeState extends UIState {
  init() {
    console.info('INIT HOME');
  }

  render() {
    return (
      withService(Home)({ uiManager: this.uiManager })
    );
  }
}

export default UIHomeState;
