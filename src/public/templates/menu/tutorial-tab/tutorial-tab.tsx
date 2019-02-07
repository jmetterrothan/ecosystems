import React from 'react';
import Slider from 'react-slick';

import Row from '@public/components/row/row';
import Col from '@public/components/col/col';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';
import Article from '@components/article/article';
import TutorialAction from './tutorial-action/tutorial-action';
import TutorialActionKey from './tutorial-action-key/tutorial-action-key';

import { KeyAction } from '@shared/constants/keys.constants';
import { translationSvc } from '@app/shared/services/translation.service';

import './tutorial-tab.styles';

class TutorialTab extends React.Component {
  render() {
    return (
      <div className='tab tutorial-tab'>
        <H3 className='color-theme mb-2'>{translationSvc.translate('UI.tutorial-tab.title')}</H3>
        <Slider dots={true} infinite={false} speed={500} slidesToShow={1} slidesToScroll={1}>
          {this.getFirstPanel()}
        </Slider>
      </div>
    );
  }

  getFirstPanel() {
    return (
      <Article className='page page--1 pb-2'>
        <H4 className='mb-2 align-left'>{translationSvc.translate('UI.tutorial-tab.subtitle_mouse')}</H4>
        <Row>
          <Col className='flexcol--12-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialAction size={2} actionName={translationSvc.translate('UI.tutorial-tab.mouse_left-click_name')} text={translationSvc.translate('UI.tutorial-tab.mouse_left-click')} className='mb-2' />
              <TutorialAction size={2} actionName={translationSvc.translate('UI.tutorial-tab.mouse_scroll_name')} text={translationSvc.translate('UI.tutorial-tab.mouse_scroll')} className='mb-2' />
            </div>
          </Col>
        </Row>

        <H4 className='mt-3 mb-2 align-left'>{translationSvc.translate('UI.tutorial-tab.subtitle_keyboard')}</H4>
        <Row>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_UP} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_FRONT} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_DOWN} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_LEFT} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-2' action={KeyAction.MOVE_BACK} canEdit={true} />
            </div>
          </Col>
          <Col className='flexcol--8-t'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-3' action={KeyAction.MOVE_RIGHT} canEdit={true}/>
            </div>
          </Col>
        </Row>
        <Row>
          <Col className='flexcol--24'>
            <div className='tutorial-keys'>
              <TutorialActionKey className='mb-3' size={2} action={KeyAction.MENU} canEdit={false} />
              <TutorialActionKey className='mb-2' action={KeyAction.RELOAD} canEdit={false} />
              <TutorialActionKey className='mb-2' action={KeyAction.VOCAL} canEdit={true} />
              <TutorialActionKey className='' action={KeyAction.MUTE} canEdit={true} />
            </div>
          </Col>
        </Row>
      </Article>
    );
  }
}

export default TutorialTab;
