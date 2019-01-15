import Main from '@app/Main';
import UIState from '@ui/UIState';

import withService from '@public/components/withService/withService';

import { IServices } from '@ui/models/services.model';

import Loading from '@templates/Loading/loading';

import { UI_STATES } from '../enums/UIStates.enum';

class UILoadingState extends UIState {

  async init() {
    // TODO: add loader
    console.info('INIT LOADING');

    const app = new Main();
    // await app.init();
    // await app.load();
    // app.run();

    this.uiManager.switchState(UI_STATES.GAME);
    // document.body.requestPointerLock();
  }

  render() {
    return (
      withService(Loading)({ uiManager: this.uiManager } as IServices)
    );
  }
}

export default UILoadingState;
