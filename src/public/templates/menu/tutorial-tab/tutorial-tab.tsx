import React from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';

import Row from '@public/components/row/row';
import Col from '@public/components/col/col';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';
import Article from '@components/article/article';
import TutorialKey from './tutorialKey/tutorial-key';

import { Keys } from '@shared/constants/keys.constants';
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
        <form>
          <H4 className='mb-2 align-left'>{translationSvc.translate('UI.tutorial-tab.subtitle_mouse')}</H4>
          <Row>
            <Col className='flexcol--12-t mb-2 mb-0-t'>
              <div className='tutorial-keys'>
                <TutorialKey className='mb-2' name={translationSvc.translate('UI.tutorial-tab.mouse_left-click_name')} text={translationSvc.translate('UI.tutorial-tab.mouse_left-click')} />
                <TutorialKey className='' name={translationSvc.translate('UI.tutorial-tab.mouse_scroll_name')} text={translationSvc.translate('UI.tutorial-tab.mouse_scroll')} />
              </div>
            </Col>
          </Row>

          <H4 className='mt-3 mb-2 align-left'>{translationSvc.translate('UI.tutorial-tab.subtitle_keyboard')}</H4>
          <Row>
            <Col className='flexcol--8-t mb-2 mb-0-t'>
              <div className='tutorial-keys'>
                <TutorialKey className='mb-2' name={Keys.up} text={translationSvc.translate('UI.tutorial-tab.key_up')} />
              </div>
            </Col>
            <Col className='flexcol--8-t mb-2 mb-0-t'>
              <div className='tutorial-keys'>
                <TutorialKey className='mb-2' name={Keys.front} text={translationSvc.translate('UI.tutorial-tab.key_front')} />
              </div>
            </Col>
            <Col className='flexcol--8-t'>
              <div className='tutorial-keys'>
                <TutorialKey className='mb-2' name={Keys.down} text={translationSvc.translate('UI.tutorial-tab.key_down')} />
              </div>
            </Col>
            <Col className='flexcol--8-t mb-2 mb-0-t'>
              <div className='tutorial-keys'>
                <TutorialKey className='mb-2' name={Keys.left} text={translationSvc.translate('UI.tutorial-tab.key_left')} />
              </div>
            </Col>
            <Col className='flexcol--8-t mb-2 mb-0-t'>
              <div className='tutorial-keys'>
                <TutorialKey className='mb-2' name={Keys.back} text={translationSvc.translate('UI.tutorial-tab.key_back')} />
              </div>
            </Col>
            <Col className='flexcol--8-t'>
              <div className='tutorial-keys'>
                <TutorialKey className='mb-3' name={Keys.right} text={translationSvc.translate('UI.tutorial-tab.key_right')} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col className='flexcol--24'>
              <div className='tutorial-keys'>
                <TutorialKey className='mb-3' name={translationSvc.translate('UI.tutorial-tab.key_menu_name')} text={translationSvc.translate('UI.tutorial-tab.key_menu')} />
                <TutorialKey className='mb-2' name={Keys.reload} text={translationSvc.translate('UI.tutorial-tab.key_reload')} />
                <TutorialKey className='mb-2' name={Keys.vocal} text={translationSvc.translate('UI.tutorial-tab.key_vocal')} />
                <TutorialKey className='' name={Keys.mute} text={translationSvc.translate('UI.tutorial-tab.key_mute')} />
              </div>
            </Col>
          </Row>
        </form>
      </Article>
    );
  }
}

export default TutorialTab;
