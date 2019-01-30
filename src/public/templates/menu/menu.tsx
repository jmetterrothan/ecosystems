import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Button from '@public/components/button/button';
import UIManager from '@app/ui/UIManager';
import { UI_STATES } from '@ui/enums/UIStates.enum';

import Trophies from '@templates/menu/trophies/trophies';
import Tutorial from '@templates/menu/tutorial/tutorial';
import Credits from '@templates/menu/credits/credits';
import Progress from '@templates/menu/progress/progress';

import './menu.styles';

interface Props {
  uiManager: UIManager;
}

class Menu extends React.PureComponent<Props> {

  static SELECTED_INDEX: number = 2;

  handleClick = () => {
    const { uiManager } = this.props;

    uiManager.switchState(UI_STATES.GAME);
    document.body.requestPointerLock();
  }

  reload = () => {
    window.location.reload();
  }

  render() {
    return (
      <div className='ui__state menu'>
        <div className='menu__container'>
          <Tabs defaultIndex={Menu.SELECTED_INDEX} onSelect={tabIndex => Menu.SELECTED_INDEX = tabIndex}>
            <TabList>
              <Tab><span className='ui-click-sound'>Trophées</span></Tab>
              <Tab><span className='ui-click-sound'>Progression</span></Tab>
              <Tab><span className='ui-click-sound'>Tutoriel</span></Tab>
              <Tab><span className='ui-click-sound'>Crédits</span></Tab>
            </TabList>

            <TabPanel><Trophies /></TabPanel>
            <TabPanel><Progress /></TabPanel>
            <TabPanel><Tutorial /></TabPanel>
            <TabPanel><Credits /></TabPanel>
          </Tabs>
          <footer className='menu__footer mb-3 mr-3'>
            <Button className='btn btn--darkblue btn--expand-mobile mr-2 ui-click-sound' onClick={this.reload}>Nouveau monde</Button>
            <Button className='btn btn--magenta btn--expand-mobile ui-click-sound' onClick={this.handleClick}>Continuer</Button>
          </footer>
        </div>
      </div >
    );
  }

}

export default Menu;
