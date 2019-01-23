import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import UIManager from '@app/ui/UIManager';
import { UI_STATES } from '@ui/enums/UIStates.enum';

import Button from '@components/Button/button';
import Trophies from '@templates/trophies/trophies';
import Tutorial from '@templates/tutorial/tutorial';
import Credits from '../credits/credits';
import Progress from '../progress/progress';

import './menu.styles';

interface Props {
  uiManager: UIManager;
}

class Menu extends React.PureComponent<Props> {
  constructor(props) {
    super(props);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleClick();
      }
    });
  }

  handleClick = () => {
    const { uiManager } = this.props;

    uiManager.switchState(UI_STATES.GAME);
    document.body.requestPointerLock();
  }

  render() {
    return (
      <div className='menu p-4 pt-5'>
        <div className='menu__container'>
          <Tabs>
            <TabList>
              <Tab>Trophées</Tab>
              <Tab>Progression</Tab>
              <Tab>Tutoriel</Tab>
              <Tab>Crédits</Tab>
            </TabList>

            <TabPanel>
              <Trophies />
            </TabPanel>
            <TabPanel>
              <Progress />
            </TabPanel>
            <TabPanel>
              <Tutorial />
            </TabPanel>
            <TabPanel>
              <Credits/>
            </TabPanel>
          </Tabs>
        </div>
        <footer className='menu__footer mt-2'>
          <Button className='btn btn--magenta' onClick={this.handleClick}>Revenir en jeu</Button>
        </footer>
      </div>
    );
  }

}

export default Menu;
