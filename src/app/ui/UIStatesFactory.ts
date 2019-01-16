import UIHomeState from '@ui/states/UIHomeState';
import UILoadingState from '@ui/states/UILoadingState';
import UIGameState from '@ui/states/UIGameState';

import { UI_STATES } from '@ui/enums/UIStates.enum';
import UIState from './UIState';

const UIStateFactory = (state: UI_STATES): UIState => {
  switch (state) {
    case UI_STATES.HOME: return new UIHomeState();
    case UI_STATES.LOADING: return new UILoadingState();
    case UI_STATES.GAME: return new UIGameState();
  }
};

export default UIStateFactory;
