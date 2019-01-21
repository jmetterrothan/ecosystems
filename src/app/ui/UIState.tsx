import React from 'react';

import UIManager from '@ui/UIManager';
import { IUIServices } from '@ui/models/services.model';

abstract class UIState extends React.PureComponent<void, void> {

  abstract init();

  abstract process(uiManager: UIManager);

}

export default UIState;
