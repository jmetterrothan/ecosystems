import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import UIManager from '@app/ui/UIManager';
import { UI_STATES } from '@ui/enums/UIStates.enum';

import Button from '@components/Button/button';
import Trophies from '@templates/trophies/trophies';
import Tutorial from '@templates/tutorial/tutorial';

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
        <Tabs>
          <TabList>
            <Tab>Trophées</Tab>
            <Tab>Progression</Tab>
            <Tab>Tutoriel</Tab>
          </TabList>

          <TabPanel>
            <Trophies />
          </TabPanel>
          <TabPanel>
            <h1>La progression</h1>
          </TabPanel>
          <TabPanel>
            <Tutorial />
          </TabPanel>
        </Tabs>
      </div>
    );
  }

}

export default Menu;
