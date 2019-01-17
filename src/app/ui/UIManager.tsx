import React from 'react';

import UIState from '@ui/UIState';
import UIHomeState from '@ui/states/UIHomeState';
import stateFactory from '@ui/UIStatesFactory';
import withService from '@components/withService/withService';

import { IUIServices, IManager } from './models/services.model';
import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';

interface IUIManagerProps {

}

interface IUIManagerState {
  currentUiStateID: UI_STATES;
  parameters: IUIManagerParameters;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  static readonly ENABLED: boolean = true;

  private uiStates: Map<UI_STATES, UIState>;

  constructor(props: IUIManagerProps, state: IUIManagerState) {
    super(props, state);

    this.state = {
      currentUiStateID: UI_STATES.HOME,
      parameters: {}
    };

    this.uiStates = new Map<UI_STATES, UIState>();

    // if (!UIManager.ENABLED) return;

    this.addState(UI_STATES.HOME, new UIHomeState());
  }

  render() {
    const uiState = this.uiStates.get(this.state.currentUiStateID);
    uiState.setUIManager(this);
    const services: IUIServices & IManager = {
      uiManager: this,
      ...uiState.getNeededServices()
    };

    return (
      <div className='ui full'>
        <div className='ui__state'>
          {
            withService(uiState.render())(services)
          }
        </div>
      </div>
    );
  }

  switchState(state: UI_STATES, parameters: IUIManagerParameters = null) {
    if (!this.uiStates.has(state)) this.addState(state);
    this.setState({
      currentUiStateID: state,
      parameters: parameters ? parameters : this.state.parameters
    }, async () => {
      await this.uiStates.get(state).process();
    });

  }

  handleKeyboard(key: string, active: boolean) {
    // console.log('ui handle', key, active);
  }

  private addState(key: UI_STATES, value?: UIState) {
    if (!this.uiStates.has(key)) {
      const uiState = value ? value : stateFactory(key);
      uiState.init();
      this.uiStates.set(key, uiState);
    }
  }

}

export default UIManager;
