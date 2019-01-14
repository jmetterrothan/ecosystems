import React from 'react';

import UIService, { uiSvc } from '@ui/services/ui.service';

abstract class UIState extends React.PureComponent<void, void> {

  protected uiSvc: UIService;

  constructor() {
    super();

    this.uiSvc = uiSvc;
  }
  abstract init();
}

export default UIState;
