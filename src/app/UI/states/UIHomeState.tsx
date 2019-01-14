import React from 'react';

import Home from '@templates/Home/home';

import UIState from '@ui/UIState';
import { UI_STATES } from '../enums/UIStates.enum';
import withService from '@public/components/withService/withService';

class UIHomeState extends UIState {
  init() {
    console.info('INIT HOME');
  }

  click() {
    console.log('ok');
  }

  render() {
    return (
      withService(Home)({ uiSvc: this.uiSvc })
    );
  }
}

export default UIHomeState;
