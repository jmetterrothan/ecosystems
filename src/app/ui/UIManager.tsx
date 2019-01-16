import React from 'react';

import UIState from '@ui/UIState';
import UIHomeState from '@ui/states/UIHomeState';
import UIGameState from '@ui/states/UIGameState';

import stateFactory from '@ui/UIStatesFactory';
import UIService, { uiSvc } from '@ui/services/ui.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';

interface IUIManagerProps {

}

interface IUIManagerState {
  currentUiStateID: number;
  parameters: IUIManagerParameters;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  static readonly ENABLED: boolean = false;

  private uiStates: Map<UI_STATES, UIState>;

  private uiSvc: UIService;

  constructor(props: IUIManagerProps, state: IUIManagerState) {
    super(props, state);

    this.state = {
      currentUiStateID: UI_STATES.HOME,
      parameters: {}
    };

    this.uiSvc = uiSvc;

    this.uiStates = new Map<UI_STATES, UIState>();

    if (!UIManager.ENABLED) return;

    this.addState(UI_STATES.HOME, new UIHomeState(this));
  }

  render() {
    const uiState = this.uiStates.get(this.state.currentUiStateID);

    return (
      <div className='ui full'>
        <div className='ui__state'>
          {uiState && uiState.render()}
        </div>
      </div>
    );
  }

  switchState(state: UI_STATES, parameters: IUIManagerParameters = null) {
    if (!this.uiStates.has(state)) this.addState(state);
    this.setState({
      currentUiStateID: state,
      parameters: parameters ? parameters : this.state.parameters
    }, () => {
      this.uiStates.get(state).process();
    });

    this.uiSvc.switchState(state);
  }

  handleKeyboard(key: string, active: boolean) {
    console.log('ui handle', key, active);
  }

  private addState(key: UI_STATES, value?: UIState) {
    if (!this.uiStates.has(key)) {
      const uiState = value ? value : stateFactory(key, this);
      uiState.init();
      this.uiStates.set(key, uiState);
    }
  }

}

export default UIManager;
