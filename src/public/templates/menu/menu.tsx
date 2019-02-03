import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Button from '@public/components/button/button';
import UIManager from '@app/ui/UIManager';
import { UIStates } from '@ui/enums/UIStates.enum';

import Trophies from '@templates/menu/trophies/trophies';
import Tutorial from '@templates/menu/tutorial/tutorial';
import Credits from '@templates/menu/credits/credits';
import Progress from '@templates/menu/progress/progress';
import Contact from './contact/contact';
import PointerLock from '@app/PointerLock';

import { translationSvc } from '@app/shared/services/translation.service';

import './menu.styles';

interface Props {
  uiManager: UIManager;
}

class Menu extends React.PureComponent<Props> {

  static SELECTED_INDEX: number = 0;

  handleClick = () => {
    const { uiManager } = this.props;

    uiManager.switchState(UIStates.GAME);
    PointerLock.request();
  }

  reload = () => {
    window.location.reload();
  }

  render() {
    return (
      <div className='ui__state menu'>
        <div className='menu__share'>...</div>
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
              <Tab>
                <div className='tab-menu ui-click-sound'>
                  <span className='tab-menu__icon icon-bug mb-1'/>
                  <span className='tab-menu__text'>{translationSvc.translate('UI.contact.title')}</span>
                </div>
              </Tab>
            </TabList>

            <TabPanel><div className='p-3 pb-9 pb-3-t'><Tutorial /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><Trophies /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><Progress /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><Credits /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><Contact /></div></TabPanel>
          </Tabs>
          <footer className='menu__footer mb-3 mr-3'>
            <Button className='btn--theme btn--expand-mobile ui-click-sound' onClick={this.handleClick}>{translationSvc.translate('UI.menu.continue_btn')}</Button>
            <Button className='btn--darkblue btn--expand-mobile mt-2 ui-click-sound' onClick={this.reload}>{translationSvc.translate('UI.menu.new_world_btn')}</Button>
          </footer>
        </div>
      </div >
    );
  }

}

export default Menu;
