import Home from '@templates/home/home';

import UIState from '@ui/UIState';
import UIManager from '@ui/UIManager';

class UIHomeState extends UIState {

  init() {
    console.info('INIT HOME');
  }

  process(uiManager: UIManager) { }

  render() {
    return Home;
  }
}

export default UIHomeState;
