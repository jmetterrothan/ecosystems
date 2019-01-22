import React from 'react';

import Button from '@components/Button/button';
import UIManager from '@app/ui/UIManager';
import { UI_STATES } from '@ui/enums/UIStates.enum';

import './menu.styles';

interface Props {
  uiManager: UIManager;
}

class Menu extends React.PureComponent<Props> {

  handleClick = () => {
    const { uiManager } = this.props;

    uiManager.switchState(UI_STATES.GAME);
    document.body.requestPointerLock();
  }

  render() {
    return (
      <div className='menu'>
        <Button onClick={this.handleClick}>Revenir en jeu</Button>
      </div>
    );
  }

}

export default Menu;
