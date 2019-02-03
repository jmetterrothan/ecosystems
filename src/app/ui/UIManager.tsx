import React from 'react';

import PointerLock from '@app/PointerLock';
import SoundManager from '@shared/SoundManager';
import NotificationContainer from '@public/components/notification/NotificationContainer';
import stateFactory from '@ui/UIStatesFactory';
import withUIManager from '@components/withUIManager/withUIManager';

import { uiSvc } from '@ui/services/ui.service';
import { translationSvc } from '@shared/services/translation.service';

import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

import { IUIState } from '@ui/models/UIState';
import { UIStates } from '@ui/enums/UIStates.enum';

interface IUIManagerProps {

}

interface IUIManagerState {
  currentUiStateID: UIStates;
  parameters: IUIManagerParameters;
}

class UIManager extends React.PureComponent<IUIManagerProps, IUIManagerState> {
  static readonly ENABLED: boolean = false;

  private uiStates: Map<UIStates, IUIState>;

  constructor(props: IUIManagerProps, state: IUIManagerState) {
    super(props, state);

    this.uiStates = new Map<UIStates, IUIState>();

    this.state = {
      currentUiStateID: UIStates.HOME,
      parameters: {}
    };

    translationSvc.init();

    this.addState(UIStates.HOME);

    // ui click sound
    window.addEventListener('click', (e) => {
      if (e.srcElement.classList.contains('ui-click-sound')) {
        SoundManager.play('click');
      }
    });

    document.addEventListener('pointerlockchange', () => {
      const enabled = PointerLock.enabled;

      if (enabled && this.state.currentUiStateID !== UIStates.GAME) {
        this.manageMenu(false);
      }
      if (!enabled && this.state.currentUiStateID !== UIStates.MENU) {
        this.manageMenu(true);
      }
    });

    document.body.addEventListener('keyup', e => {
      if (e.key === 'Escape' && !PointerLock.enabled) {
        PointerLock.request();
        return;
      }
    });
  }

  componentDidMount() {
    // this.switchState(UIStates.MENU);
  }

  render() {
    const uiState = this.uiStates.get(this.state.currentUiStateID);
    if (this.state.currentUiStateID === UIStates.HOME) uiState.process(this);

    return (
      <div className='ui'>
        <div className='ui__notifications p-2'>
          <NotificationContainer />
        </div>
        {withUIManager(uiState.render())(this)}
      </div>
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

  private addState(key: UIStates, value?: IUIState) {
    if (!this.uiStates.has(key)) {
      const uiState = value ? value : stateFactory(key);
      uiState.init();
      this.uiStates.set(key, uiState);
    }
  }

}

export default UIManager;
