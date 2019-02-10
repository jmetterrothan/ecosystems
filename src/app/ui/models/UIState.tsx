import UIManager from '@ui/UIManager';

export interface IUIState {
  init();
  render();
  process(uiManager: UIManager);
}
