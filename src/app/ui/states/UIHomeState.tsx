import React from 'react';

import Home from '@templates/Home/home';

import UIState from '@ui/UIState';
import withService from '@components/withService/withService';

import { IServices } from '@ui/models/services.model';
import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';
import UIManager from '../UIManager';

class UIHomeState extends UIState {
  init() {
    console.info('INIT HOME');

    // if (!UIManager.ENABLED) {
    // this.uiManager.switchState(UI_STATES.LOADING, { seed: '' } as IUIManagerParameters);
    // }
  }

  process() { }

  render() {
    return (
      // <Home />
      withService(Home)({ uiSvc: this.uiSvc } as IServices)
    );
  }
}

export default UIHomeState;
