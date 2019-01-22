import { UI_STATES } from '@ui/enums/UIStates.enum';
import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

class UIService {

  private currentState: UI_STATES;
  private parameters: IUIManagerParameters = {};

  isState(state: UI_STATES): boolean {
    return state === this.currentState;
  }

  getCurrentState(): UI_STATES {
    return this.currentState;
  }

  switchState(state: UI_STATES, parameters: IUIManagerParameters = {}) {
    this.currentState = state;
    this.parameters = {
      ...this.parameters,
      ...parameters
    };
  }

}

export const uiSvc = new UIService();
export default UIService;
