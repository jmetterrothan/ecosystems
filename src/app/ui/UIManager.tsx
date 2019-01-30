import React from 'react';

import SoundManager from '@shared/SoundManager';
import NotificationContainer from '@public/components/notification/NotificationContainer';
import UIState from '@ui/UIState';
import UIHomeState from '@ui/states/UIHomeState';
import stateFactory from '@ui/UIStatesFactory';
import withUIManager from '@public/components/withUIManager/withUIManager';

import { uiSvc } from './services/ui.service';
import { translationSvc } from '@shared/services/translation.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UI_STATES } from '@ui/enums/UIStates.enum';

interface IUIManagerProps {

}

interface IUIManagerState {
  currentUiStateID: UI_STATES;
  parameters: IUIManagerParameters;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  static readonly ENABLED: boolean = false;

  private uiStates: Map<UI_STATES, UIState>;

  constructor(props: IUIManagerProps, state: IUIManagerState) {
    super(props, state);

    this.uiStates = new Map<UI_STATES, UIState>();

    this.state = {
      currentUiStateID: UI_STATES.HOME,
      parameters: {}
    };

    translationSvc.init();

    this.addState(UI_STATES.HOME, new UIHomeState(null));

    // ui click sound
    window.addEventListener('click', (e) => {
      if (e.srcElement.classList.contains('ui-click-sound')) {
        SoundManager.play('click');
      }
    });
  }

  render() {
    const uiState = this.uiStates.get(this.state.currentUiStateID);
    if (this.state.currentUiStateID === UI_STATES.HOME) uiState.process(this);

    return (
      <div className='ui'>
        <div className='ui__notifications p-2'>
          <NotificationContainer />
        </div>
        {withUIManager(uiState.render())(this)}
      </div>
    );
  }

  switchState(state: UI_STATES, parameters?: any) {
    if (!this.uiStates.has(state)) this.addState(state);

    this.setState({
      currentUiStateID: state,
      parameters: {
        ...this.state.parameters,
        ...parameters
      }
    }, async () => {
      uiSvc.switchState(state, parameters);
      await this.uiStates.get(state).process(this);
    });
  }

  manageMenu(open: boolean) {
    this.switchState(open ? UI_STATES.MENU : UI_STATES.GAME);
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
