import React from 'react';

import UIManager from '@ui/UIManager';

abstract class UIState extends React.PureComponent {

  abstract init();

  abstract process(uiManager: UIManager);

}

export default UIState;
