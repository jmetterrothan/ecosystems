import { UI_STATES } from '@ui/enums/UIStates.enum';

class UIService {

  private currentState: UI_STATES;

  isState(state: UI_STATES): boolean {
    return state === this.currentState;
  }

  getCurrentState(): UI_STATES {
    return this.currentState;
  }

  switchState(state: UI_STATES) {
    this.currentState = state;

  }

}

export const uiSvc = new UIService();
export default UIService;
