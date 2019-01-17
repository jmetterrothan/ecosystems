import Home from '@templates/Home/home';

import UIState from '@ui/UIState';
import UIManager from '@ui/UIManager';

import { UI_STATES } from '@ui/enums/UIStates.enum';

class UIHomeState extends UIState {

  init() {
    console.info('INIT HOME');
  }

  process() {
    if (!UIManager.ENABLED) {
      this.uiManager.switchState(UI_STATES.LOADING);
    }
  }

  render() {
    return Home;
  }
}

export default UIHomeState;
