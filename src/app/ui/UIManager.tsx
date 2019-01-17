import React from 'react';

import UIState from '@ui/UIState';
import UIHomeState from '@ui/states/UIHomeState';
import stateFactory from '@ui/UIStatesFactory';
import withService from '@components/withService/withService';

import UIService, { uiSvc } from './services/ui.service';

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

  private uiSvc: UIService;

  // pages
  private trophiesPageOpen: boolean = false;

  constructor(props: IUIManagerProps, state: IUIManagerState) {
    super(props, state);

    this.uiSvc = uiSvc;

    this.state = {
      currentUiStateID: UI_STATES.HOME,
      parameters: {}
    };

    this.uiStates = new Map<UI_STATES, UIState>();

    this.addState(UI_STATES.HOME, new UIHomeState());
  }

  render() {
    const uiState = this.uiStates.get(this.state.currentUiStateID);
    uiState.setUIManager(this);
    if (this.state.currentUiStateID === UI_STATES.HOME) uiState.process();
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

  switchState(state: UI_STATES, parameters: IUIManagerParameters = {}) {
    if (!this.uiStates.has(state)) this.addState(state);
    this.setState({
      currentUiStateID: state,
      parameters: {
        ...this.state.parameters,
        ...parameters
      }
    }, async () => {
      this.uiSvc.switchState(state, parameters);
      await this.uiStates.get(state).process();
    });
  }

  handleKeyboard(key: string) {
    switch (key) {
      case 't': case 'T': this.manageTrophiesPage();
    }
  }

  private manageTrophiesPage() {
    this.switchState(!this.trophiesPageOpen ? UI_STATES.TROPHIES : UI_STATES.GAME);
    this.trophiesPageOpen = !this.trophiesPageOpen;
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
