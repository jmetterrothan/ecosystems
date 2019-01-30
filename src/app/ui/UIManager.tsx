import React from 'react';

import SoundManager from '@shared/SoundManager';
import NotificationContainer from '@public/components/notification/NotificationContainer';
import UIState from '@ui/UIState';
import UIHomeState from '@ui/states/UIHomeState';
import stateFactory from '@ui/UIStatesFactory';
import withUIManager from '@public/components/withUIManager/withUIManager';
import CookiesConsent from '@public/components/cookies/cookies-consent';

import UIService, { uiSvc } from './services/ui.service';
import { translationSvc } from '@shared/services/translation.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { UIStates } from '@ui/enums/UIStates.enum';

interface IUIManagerProps {

}

interface IUIManagerState {
  currentUiStateID: UIStates;
  parameters: IUIManagerParameters;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  static readonly ENABLED: boolean = false;

  private uiStates: Map<UIStates, UIState>;

  constructor(props: IUIManagerProps, state: IUIManagerState) {
    super(props, state);

    this.uiStates = new Map<UIStates, UIState>();

    this.state = {
      currentUiStateID: UIStates.HOME,
      parameters: {}
    };

    translationSvc.init();

    this.addState(UIStates.HOME, new UIHomeState(null));

    // ui click sound
    window.addEventListener('click', (e) => {
      if (e.srcElement.classList.contains('ui-click-sound')) {
        SoundManager.play('click');
      }
    });
  }

  componentDidMount() {
    /*
    notificationSvc.push({
      id: '0',
      icon: null,
      label: 'label',
      content: 'very long and awkward content',
      duration: 5000
    });
    */
    // this.switchState(UIStates.LOADING);
  }

  render() {
    const uiState = this.uiStates.get(this.state.currentUiStateID);
    if (this.state.currentUiStateID === UIStates.HOME) uiState.process(this);

    return (
      <>
        <CookiesConsent />
        <div className='ui'>
          <div className='ui__notifications p-2'>
            <NotificationContainer />
          </div>
          {withUIManager(uiState.render())(this)}
        </div>
      </>
    );
  }

  switchState(state: UIStates, parameters?: any) {
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
    this.switchState(open ? UIStates.MENU : UIStates.GAME);
  }

  private addState(key: UIStates, value?: UIState) {
    if (!this.uiStates.has(key)) {
      const uiState = value ? value : stateFactory(key);
      uiState.init();
      this.uiStates.set(key, uiState);
    }
  }

}

export default UIManager;
