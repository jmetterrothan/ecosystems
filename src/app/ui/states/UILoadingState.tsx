import Main from '@app/Main';
import UIState from '@ui/UIState';

import { IServices } from '@ui/models/services.model';

import withService from '@components/withService/withService';
import Loading from '@templates/Loading/loading';

import { UI_STATES } from '@ui/enums/UIStates.enum';

class UILoadingState extends UIState {

  app: Main;

  async init() {
    // TODO: add loader
    console.info('INIT LOADING');

  }

  async process() {
    const { state } = this.uiManager;

    const app = new Main();
    await app.init();
    const seed = await app.load(state.parameters.seed);
    app.run();

    document.body.requestPointerLock();
    this.uiManager.switchState(UI_STATES.GAME, { seed });
  }

  render() {
    return (
      withService(Loading)({ uiManager: this.uiManager } as IServices)
    );
  }
}

export default UILoadingState;
