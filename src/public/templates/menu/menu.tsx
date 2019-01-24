import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import UIManager from '@app/ui/UIManager';
import { UI_STATES } from '@ui/enums/UIStates.enum';

import Button from '@components/button/button';
import Trophies from '@templates/trophies/trophies';
import Tutorial from '@templates/tutorial/tutorial';
import Credits from '../credits/credits';
import Progress from '../progress/progress';

import './menu.styles';
import Row from '@public/components/row/row';
import Col from '@public/components/col/col';

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
      <div className='ui-container menu p-2 p-4-l pb-3-l pt-5-l'>
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
              <Credits />
            </TabPanel>
          </Tabs>
        </div>
        <footer className='menu__footer mt-2'>
          <Button className='btn btn--darkblue btn--expand-mobile mb-2 mb-0-t mr-3-t' onClick={this.reload}>Nouveau monde</Button>
          <Button className='btn btn--magenta btn--expand-mobile' onClick={this.handleClick}>Continuer</Button>
        </footer>
      </div>
    );
  }

}

export default Menu;