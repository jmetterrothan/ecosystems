import React from 'react';

import UIState from '@ui/UIState';
import UIHomeState from '@ui/states/UIHomeState';
import UIGameState from '@ui/states/UIGameState';

import UIService, { uiSvc } from '@ui/services/ui.service';

import stateFactory from '@ui/UIStatesFactory';

import { UI_STATES } from '@ui/enums/UIStates.enum';

interface IUIManagerProps {

}

interface IUIManagerState {
  currentUiStateID: number;
  parameters: Object;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  static readonly ENABLED: boolean = true;

  private states: Map<UI_STATES, UIState>;

  private uiSvc: UIService;

  constructor(props: IUIManagerProps) {
    super(props);

    this.state = {
      currentUiStateID: UI_STATES.HOME,
      parameters: null
    };

    this.uiSvc = uiSvc;

    this.states = new Map<UI_STATES, UIState>();
    this.addState(UI_STATES.HOME, new UIHomeState(this));
  }

  render() {
    const uiState = this.states.get(this.state.currentUiStateID);
    console.log(uiState, this.state);

    // TODO: Parameters Provider
    return (
      <div className='ui full'>
        <div className='ui__state'>
          {uiState && uiState.render()}
        </div>
      </div>
    );
  }

  private addState(key: UI_STATES, value?: UIState) {
    if (!this.states.has(key)) {
      const uiState = value ? value : stateFactory(key, this);
      uiState.init();
      this.states.set(key, uiState);
    }
  }

  public switchState(state: UI_STATES, parameters: Object = null) {
    if (!this.states.has(state)) this.addState(state);
    this.setState({
      currentUiStateID: state,
      parameters: parameters ? parameters : this.state.parameters
    });

    this.uiSvc.switchState(state);
  }
}

export default UIManager;
