import UIManager from '@ui/UIManager';

import UIState from '@ui/UIState';
import UIHomeState from '@ui/states/UIHomeState';
import UILoadingState from '@ui/states/UILoadingState';
import UIGameState from '@ui/states/UIGameState';

import { UI_STATES } from '@ui/enums/UIStates.enum';

const UIStateFactory = (state: UI_STATES, manager: UIManager): UIState => {
  switch (state) {
    case UI_STATES.HOME: return new UIHomeState(manager);
    case UI_STATES.LOADING: return new UILoadingState(manager);
    case UI_STATES.GAME: return new UIGameState(manager);
  }
};

export default UIStateFactory;
