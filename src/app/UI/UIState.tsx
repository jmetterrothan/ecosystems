import React from 'react';

import UIManager from '@ui/UIManager';

abstract class UIState extends React.PureComponent<void, void> {

  protected uiManager: UIManager;

  constructor(uiManager: UIManager) {
    super();

    this.uiManager = uiManager;
  }

  abstract init();
}

export default UIState;
