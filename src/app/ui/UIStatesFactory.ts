import { IUIState } from '@ui/models/UIState';

import UIHomeState from '@ui/states/UIHomeState';
import UILoadingState from '@ui/states/UILoadingState';
import UIGameState from '@ui/states/UIGameState';
import UIMenuState from '@ui/states/UIMenuState';

import { UI_STATES } from '@ui/enums/UIStates.enum';

const UIStateFactory = (state: UI_STATES): IUIState => {
  switch (state) {
    case UI_STATES.HOME: return new UIHomeState(null);
    case UI_STATES.LOADING: return new UILoadingState(null);
    case UI_STATES.GAME: return new UIGameState(null);
    case UI_STATES.MENU: return new UIMenuState(null);
  }
};

export default UIStateFactory;
