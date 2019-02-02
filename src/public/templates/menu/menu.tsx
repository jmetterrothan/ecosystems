import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Button from '@public/components/button/button';
import UIManager from '@app/ui/UIManager';
import { UIStates } from '@ui/enums/UIStates.enum';

import Trophies from '@templates/menu/trophies/trophies';
import Tutorial from '@templates/menu/tutorial/tutorial';
import Credits from '@templates/menu/credits/credits';
import Progress from '@templates/menu/progress/progress';

import './menu.styles';
import { translationSvc } from '@app/shared/services/translation.service';

interface Props {
  uiManager: UIManager;
}

class Menu extends React.PureComponent<Props> {

  static SELECTED_INDEX: number = 0;

  handleClick = () => {
    const { uiManager } = this.props;

    uiManager.switchState(UIStates.GAME);
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
              <Tab>
                <div className='tab-menu ui-click-sound'>
                  <span className='tab-menu__icon icon-lifebuoy mb-1'/>
                  <span className='tab-menu__text'>{translationSvc.translate('UI.tutorial.title')}</span>
                </div>
              </Tab>
              <Tab>
                <div className='tab-menu ui-click-sound'>
                  <span className='tab-menu__icon icon-trophy mb-1'/>
                  <span className='tab-menu__text'>{translationSvc.translate('UI.trophies.title')}</span>
                </div>
              </Tab>
              <Tab>
                <div className='tab-menu ui-click-sound'>
                  <span className='tab-menu__icon icon-meter mb-1'/>
                  <span className='tab-menu__text'>{translationSvc.translate('UI.progression.title')}</span>
                </div>
              </Tab>
              <Tab>
                <div className='tab-menu ui-click-sound'>
                  <span className='tab-menu__icon icon-users mb-1'/>
                  <span className='tab-menu__text'>{translationSvc.translate('UI.credits.title')}</span>
                </div>
              </Tab>
            </TabList>

            <TabPanel><div className='p-3'><Tutorial /></div></TabPanel>
            <TabPanel><div className='p-3'><Trophies /></div></TabPanel>
            <TabPanel><div className='p-3'><Progress /></div></TabPanel>
            <TabPanel><div className='p-3'><Credits /></div></TabPanel>
          </Tabs>
          <footer className='menu__footer mb-3 mr-3'>
            <Button className='btn--darkblue btn--expand-mobile mb-2 mb-0-t mr-2 ui-click-sound' onClick={this.reload}>{translationSvc.translate('UI.menu.new_world_btn')}</Button>
            <Button className='btn--theme btn--expand-mobile ui-click-sound' onClick={this.handleClick}>{translationSvc.translate('UI.menu.continue_btn')}</Button>
          </footer>
        </div>
      </div >
    );
  }

}

export default Menu;
