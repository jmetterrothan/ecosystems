import React from 'react';

import UIState from '@ui/UIState';

class UIHomeState extends UIState {
  init() {
    console.info('INIT HOME');
  }

  render() {
    return <div className="ui-state">
      home
    </div>;
  }
}

export default UIHomeState;
