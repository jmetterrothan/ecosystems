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
  parameters: Object;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  static readonly ENABLED: boolean = true;

  private uiStates: Map<UI_STATES, UIState>;

  private uiSvc: UIService;

  constructor(props: IUIManagerProps, context: IUIManagerState) {
    super(props, context);

    this.state = {
      currentUiStateID: UI_STATES.HOME,
      parameters: null
    };

    this.uiSvc = uiSvc;

    this.uiStates = new Map<UI_STATES, UIState>();
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

  private addState(key: UI_STATES, value?: UIState) {
    if (!this.uiStates.has(key)) {
      const uiState = value ? value : stateFactory(key, this);
      uiState.init();
      this.uiStates.set(key, uiState);
    }
  }

  public switchState(state: UI_STATES, parameters: IUIManagerParameters = null) {
    if (!this.uiStates.has(state)) this.addState(state);
    this.setState({
      currentUiStateID: state,
      parameters: parameters ? parameters : this.state.parameters
    });

    this.uiSvc.switchState(state);
  }
}

export default UIManager;
