import React from 'react';

import { UI_STATES } from '@ui/enums/UIStates.enum';

import UIState from '@ui/UIState';
import UIHomeState from './states/UIHomeState';
import UIGameState from './states/UIGameState';

interface IUIManagerProps {

}

interface IUIManagerState {
  currentUiStateID: number;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  private states: Map<UI_STATES, UIState>;

  constructor(props) {
    super(props);

    this.state = {
      currentUiStateID: UI_STATES.HOME
    };

    this.states = new Map<UI_STATES, UIState>();
    this.addState(UI_STATES.HOME, new UIHomeState());
    this.addState(UI_STATES.GAME, new UIGameState());
  }

  render() {
    const uiState = this.states.get(this.state.currentUiStateID);

    return <div className="ui">
      <div className="ui__state">
        {uiState ? uiState.render() : null}
      </div>
    </div>;
  }

  private addState(key: UI_STATES, value: UIState) {
    if (!this.states.has(key)) {
      value.init();
      this.states.set(key, value);
    }
  }

  public switchState(state: UI_STATES) {
    this.setState({ currentUiStateID : state });
  }
}

export default UIManager;
