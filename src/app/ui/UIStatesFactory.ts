import UIHomeState from '@ui/states/UIHomeState';
import UILoadingState from '@ui/states/UILoadingState';
import UIGameState from '@ui/states/UIGameState';

import { UI_STATES } from '@ui/enums/UIStates.enum';
import { IUIState } from './models/uiState.model';

const UIStateFactory = (state: UI_STATES): IUIState => {
  switch (state) {
    case UI_STATES.HOME: return new UIHomeState(null);
    case UI_STATES.LOADING: return new UILoadingState(null);
    case UI_STATES.GAME: return new UIGameState(null);
  }
};

export default UIStateFactory;
