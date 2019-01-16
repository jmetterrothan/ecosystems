import React from 'react';

import UIManager from '@ui/UIManager';
import UIService, { uiSvc } from './services/ui.service';

abstract class UIState extends React.PureComponent<void, void> {

  protected uiSvc: UIService;

  constructor() {
    super();
  }

  abstract init();

  abstract process();
}

export default UIState;
