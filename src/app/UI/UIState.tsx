import React from 'react';

import UIManager from '@ui/UIManager';

abstract class UIState extends React.PureComponent<void, void> {

  protected uiManager: UIManager;

  constructor(uiManger: UIManager) {
    super();

    this.uiManager = uiManger;
  }

  abstract init();
}

export default UIState;
