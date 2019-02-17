import React from 'react';
import Slider from 'react-slick';
import i18next from 'i18next';

import Row from '@public/components/row/row';
import Col from '@public/components/col/col';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';
import Article from '@components/article/article';
import TutorialAction from './tutorial-action/tutorial-action';
import TutorialActionKey from './tutorial-action-key/tutorial-action-key';
import Button from '@public/components/button/button';

import { translationSvc } from '@shared/services/translation.service';
import { storageSvc } from '@shared/services/storage.service';

import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { KeyAction, Keys, KeysTmp } from '@shared/constants/keys.constants';

import './tutorial-tab.styles';

type ITutorialTabsState = {
  storage: Object;
  currentLanguage: string;
};

class TutorialTab extends React.Component<any, ITutorialTabsState> {

  constructor(props) {
    super(props);

    this.state = {
      storage: Keys,
      currentLanguage: i18next.language
    };
  }

  handleKeyChange = (action: string, key: string) => {
    Keys[action] = key.toUpperCase();
    this.setState({ storage: Keys }, () => {
      storageSvc.set(STORAGES_KEY.keyboard, this.state.storage);
    });
  }

  changeLanguage = async () => {
    await translationSvc.switchLanguage(this.state.currentLanguage === 'fr' ? 'en' : 'fr');
    this.setState({ currentLanguage: translationSvc.getCurrentLanguage() });
  }

  render() {
    return (
      <div className='tab tutorial-tab'>
        <header className='tab__header'>
          <H3 className='color-theme mb-2'>{translationSvc.translate('UI.tutorial-tab.title')}</H3>
        </header>
        <div className='tab__content'>
          <Slider dots={true} vertical={false} infinite={false} speed={500} slidesToShow={1} slidesToScroll={1}>
            {this.getFirstPanel()}
            {this.getSecondPanel()}
          </Slider>
        </div>
      </div>
    );
  }

  reset = () => {
    const originalKeys = Object.assign({}, KeysTmp);

    for (const keyName in Keys) {
      if (originalKeys.hasOwnProperty(keyName)) {
        Keys[keyName] = originalKeys[keyName];
      }
    }

    this.setState({ storage: originalKeys }, () => {
      storageSvc.set(STORAGES_KEY.keyboard, this.state.storage);
    });
  }

  getFirstPanel() {
    return (
      <Article className='page page--1 pb-2'>
        <p className='paragraph mb-3'>{translationSvc.translate('UI.tutorial-tab.tab1.intro')}</p>
        <H4 className='mb-2 align-left'>{translationSvc.translate('UI.tutorial-tab.tab1.subtitle_mouse')}</H4>
        <Row>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialAction actionName={translationSvc.translate('UI.tutorial-tab.tab1.mouse_left-click_name')} text={translationSvc.translate('UI.tutorial-tab.tab1.mouse_left-click')} className='mb-2' />
            </div>
          </Col>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialAction actionName={translationSvc.translate('UI.tutorial-tab.tab1.mouse_scroll_name')} text={translationSvc.translate('UI.tutorial-tab.tab1.mouse_scroll')} className='mb-2' />
            </div>
          </Col>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialAction actionName={translationSvc.translate('UI.tutorial-tab.tab1.mouse_right-click_name')} text={translationSvc.translate('UI.tutorial-tab.tab1.mouse_right-click')} className='mb-2' />
            </div>
          </Col>
        </Row>

        <H4 className='mt-2 mb-2 align-left'>{translationSvc.translate('UI.tutorial-tab.tab1.subtitle_keyboard')}</H4>
        <Row>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_UP} onKeyChange={this.handleKeyChange} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-1' action={KeyAction.MOVE_FRONT} onKeyChange={this.handleKeyChange} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_DOWN} onKeyChange={this.handleKeyChange} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_LEFT} onKeyChange={this.handleKeyChange} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_BACK} onKeyChange={this.handleKeyChange} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_RIGHT} onKeyChange={this.handleKeyChange} canEdit={true} />
            </div>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MENU} onKeyChange={this.handleKeyChange} canEdit={false} />
              <TutorialActionKey className='mb-2' action={KeyAction.RELOAD} onKeyChange={this.handleKeyChange} canEdit={false} />
            </div>
          </Col>
          <Col className='flexcol--16-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.VOCAL} onKeyChange={this.handleKeyChange} canEdit={true} />
              <TutorialActionKey className='' action={KeyAction.MUTE} onKeyChange={this.handleKeyChange} canEdit={true} />
            </div>
          </Col>
        </Row>

        <Row className='mt-3 mb-2'>
          <Col className='flexcol--24 flex justify-content--end'>
            <Button className='btn--darkblue btn--expand-mobile' onClick={this.reset}>{translationSvc.translate('UI.tutorial-tab.tab1.reset_btn')}</Button>
          </Col>
        </Row>
      </Article>
    );
  }

  getSecondPanel() {
    return (
      <Article className='page page--2 pb-2'>
        <p className='paragraph mb-3'>{translationSvc.translate('UI.tutorial-tab.tab2.intro')}</p>
        <H4 className='mb-2 align-left'>{translationSvc.translate('UI.tutorial-tab.tab2.subtitle')}</H4>
        <p className='paragraph mb-2'>{translationSvc.translate('UI.tutorial-tab.tab2.text')}</p>
      </Article>
    );
  }

  getThirdPanel() {
    return (
    <>
      <button onClick={this.changeLanguage}>change</button>
    </>
    );
  }
}

export default TutorialTab;
