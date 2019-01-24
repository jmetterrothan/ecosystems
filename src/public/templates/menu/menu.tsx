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
  handleClick = () => {
    const { uiManager } = this.props;

    uiManager.switchState(UI_STATES.GAME);
    document.body.requestPointerLock();
  }

  reload() {
    window.location.reload();
  }

  render() {
    return (
      <div className='ui__state menu'>
        <div className='menu__container'>
          <Tabs>
            <TabList>
              <Tab>Trophées</Tab>
              <Tab>Progression</Tab>
              <Tab>Tutoriel</Tab>
              <Tab>Crédits</Tab>
            </TabList>
            <TabPanel><Trophies /></TabPanel>
            <TabPanel><Progress /></TabPanel>
            <TabPanel><Tutorial /></TabPanel>
            <TabPanel><Credits /></TabPanel>
          </Tabs>
          <footer className='menu__footer mb-3 mr-3'>
            <Button className='btn btn--darkblue btn--expand-mobile mr-2' onClick={this.reload}>Nouveau monde</Button>
            <Button className='btn btn--magenta btn--expand-mobile' onClick={this.handleClick}>Continuer</Button>
          </footer>
        </div>
      </div>
    );
  }

}

export default Menu;
