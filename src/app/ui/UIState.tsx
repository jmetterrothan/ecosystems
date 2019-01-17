import React from 'react';

import UIManager from '@ui/UIManager';
import { IUIServices } from '@ui/models/services.model';

abstract class UIState extends React.PureComponent<void, void> {

  protected services: IUIServices;
  protected uiManager: UIManager;

  abstract init();

  abstract process();

  setUIManager(uiManager: UIManager) {
    this.uiManager = uiManager;
  }

  getNeededServices(): IUIServices {
    return this.services;
  }

}

export default UIState;
