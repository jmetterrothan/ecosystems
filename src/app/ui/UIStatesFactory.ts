import React from 'react';

import Home from '@templates/Home/home';

import UIManager from '@ui/UIManager';

import UIHomeState from '@ui/states/UIHomeState';
import UILoadingState from '@ui/states/UILoadingState';
import UIGameState from '@ui/states/UIGameState';

import { UI_STATES } from '@ui/enums/UIStates.enum';
import { UIState } from '@ui/UIState';

const UIStateFactory = (state: UI_STATES): UIState => {
  switch (state) {
    case UI_STATES.HOME: return new UIHomeState(null, null);
    case UI_STATES.LOADING: return new UILoadingState(null, null);
    case UI_STATES.GAME: return new UIGameState(null, null);
  }
};

export default UIStateFactory;
