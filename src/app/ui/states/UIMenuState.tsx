import UIState from '@ui/UIState';
import UIManager from '@ui/UIManager';

import Menu from '@templates/menu/menu';

class UIMenuState extends UIState {

  init() {
    console.info('INIT MENU');
  }

  process(uiManager: UIManager) { }

  render() {
    return Menu;
  }
}

export default UIMenuState;
