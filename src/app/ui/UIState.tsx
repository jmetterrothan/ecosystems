import React from 'react';

import UIManager from '@ui/UIManager';
import { IUIServices } from '@ui/models/services.model';

abstract class UIState extends React.PureComponent<void, void> {

  protected services: IUIServices;

  abstract init();

  abstract process(uiManager: UIManager);

  getNeededServices(): IUIServices {
    return this.services;
  }

}

export default UIState;
