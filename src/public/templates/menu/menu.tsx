import React from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import Button from '@public/components/button/button';
import UIManager from '@app/ui/UIManager';
import { UIStates } from '@ui/enums/UIStates.enum';
import { H2, H1 } from '@public/components/hx/hx';

import TrophiesTab from '@templates/menu/trophies-tab/trophies-tab';
import TutorialTab from '@templates/menu/tutorial-tab/tutorial-tab';
import CreditsTab from '@templates/menu/credits-tab/credits-tab';
import ProgressTab from '@templates/menu/progress-tab/progress-tab';
import ContactTab from '@templates/menu/contact-tab/contact-tab';
import HomeTab from '@templates/menu/home-tab/home-tab';

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
                <div className='tabs-menu ui-click-sound'>
                  <span className='tabs-menu__icon icon-leaf mb-1' />
                  <span className='tabs-menu__text'>{translationSvc.translate('UI.home-tab.title')}</span>
                </div>
              </Tab>
              <Tab>
                <div className='tabs-menu ui-click-sound'>
                  <span className='tabs-menu__icon icon-lifebuoy mb-1' />
                  <span className='tabs-menu__text'>{translationSvc.translate('UI.tutorial-tab.title')}</span>
                </div>
              </Tab>
              <Tab>
                <div className='tabs-menu ui-click-sound'>
                  <span className='tabs-menu__icon icon-trophy mb-1' />
                  <span className='tabs-menu__text'>{translationSvc.translate('UI.trophies-tab.title')}</span>
                </div>
              </Tab>
              <Tab>
                <div className='tabs-menu ui-click-sound'>
                  <span className='tabs-menu__icon icon-meter mb-1' />
                  <span className='tabs-menu__text'>{translationSvc.translate('UI.progress-tab.title')}</span>
                </div>
              </Tab>
              <Tab>
                <div className='tabs-menu ui-click-sound'>
                  <span className='tabs-menu__icon icon-users mb-1' />
                  <span className='tabs-menu__text'>{translationSvc.translate('UI.credits-tab.title')}</span>
                </div>
              </Tab>
              <Tab>
                <div className='tabs-menu ui-click-sound'>
                  <span className='tabs-menu__icon icon-bug mb-1' />
                  <span className='tabs-menu__text'>{translationSvc.translate('UI.contact-tab.title')}</span>
                </div>
              </Tab>
            </TabList>

            <TabPanel><div className='p-3 pb-9 pb-3-t'><HomeTab /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><TutorialTab /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><TrophiesTab /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><ProgressTab /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><CreditsTab /></div></TabPanel>
            <TabPanel><div className='p-3 pb-9 pb-3-t'><ContactTab {...this.props} /></div></TabPanel>
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
