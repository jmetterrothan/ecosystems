import Loading from '@templates/Loading/loading';

import UIState from '@ui/UIState';
import withService from '@public/components/withService/withService';

import { IServices } from '@ui/models/services.model';

class UILoadingState extends UIState {
  init() {
    console.info('INIT LOADING');
  }

  render() {
    return (
      withService(Loading)({ uiManager: this.uiManager } as IServices)
    );
  }
}

export default UILoadingState;
