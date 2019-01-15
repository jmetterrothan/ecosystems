import Home from '@templates/Home/home';

import UIState from '@ui/UIState';
import withService from '@components/withService/withService';

import { IServices } from '@ui/models/services.model';

class UIHomeState extends UIState {

  init() {
    console.info('INIT HOME');
  }

  process() { }

  render() {
    return (
      withService(Home)({ uiManager: this.uiManager } as IServices)
    );
  }
}

export default UIHomeState;
