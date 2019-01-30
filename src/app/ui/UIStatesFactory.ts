import { IUIState } from '@ui/models/UIState';

import UIHomeState from '@ui/states/UIHomeState';
import UILoadingState from '@ui/states/UILoadingState';
import UIGameState from '@ui/states/UIGameState';
import UIMenuState from '@ui/states/UIMenuState';

import { UIStates } from '@ui/enums/UIStates.enum';

const UIStateFactory = (state: UIStates): IUIState => {
  switch (state) {
    case UIStates.HOME: return new UIHomeState(null);
    case UIStates.LOADING: return new UILoadingState(null);
    case UIStates.GAME: return new UIGameState(null);
    case UIStates.MENU: return new UIMenuState(null);
  }
};

export default UIStateFactory;
