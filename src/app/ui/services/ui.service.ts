import { UIStates } from '@ui/enums/UIStates.enum';
import { IUIManagerParameters } from '@ui/models/uiManagerParameters.model';

class UIService {

  private currentState: UIStates;
  private parameters: IUIManagerParameters = {};

  isState(state: UIStates): boolean {
    return state === this.currentState;
  }

  getCurrentState(): UIStates {
    return this.currentState;
  }

  switchState(state: UIStates, parameters: IUIManagerParameters = {}) {
    this.currentState = state;
    this.parameters = {
      ...this.parameters,
      ...parameters
    };
  }

}

export const uiSvc = new UIService();
export default UIService;
