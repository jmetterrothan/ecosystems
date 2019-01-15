import Game from '@templates/Game/game';

import UIState from '@ui/UIState';
import withService from '@public/components/withService/withService';

import { IServices } from '@ui/models/services.model';

class UIGameState extends UIState {
  init() {
    console.info('INIT GAME');
  }

  isValid(): boolean {
    return true;
  }

  render() {
    return (
      withService(Game)({ uiManager: this.uiManager } as IServices)
    );
  }
}

export default UIGameState;
