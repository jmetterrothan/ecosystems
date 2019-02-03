import React from 'react';
import Slider from 'react-slick';
import classNames from 'classnames';

import Row from '@public/components/row/row';
import Col from '@public/components/col/col';
import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';
import Article from './article/article';
import TutorialKey from './tutorialKey/tutorialKey';

import { Keys } from '@shared/constants/keys.constants';
import { Biomes } from '@app/world/constants/biomes.constants';
import { achievementSvc } from '@app/achievements/services/achievement.service';
import { translationSvc } from '@app/shared/services/translation.service';

import './tutorial.styles';

class Tutorial extends React.Component {
  render() {
    return (
      <div className='tab tab--tutorial'>
        <H3 className='color-theme mb-2'>{translationSvc.translate('UI.tutorial.title')}</H3>
        <Slider dots={true} infinite={false} speed={500} slidesToShow={1} slidesToScroll={1}>
          {this.getFirstPanel()}
          {this.getSecondPanel()}
        </Slider>
      </div>
    );
  }

  getFirstPanel() {
    return (
      <Article className='page page--1 pb-2'>
        <H4 className='mb-2'>{translationSvc.translate('UI.tutorial.title_project')}</H4>
        <p className='paragraph mb-2'>{translationSvc.translate('UI.tutorial.article.p1')}</p>
        <p className='paragraph mb-2'>{translationSvc.translate('UI.tutorial.article.p2', { count: Biomes.length })}</p>
        <p className='paragraph mb-3'>{translationSvc.translate('UI.tutorial.article.p3', { count: achievementSvc.getTrophiesCount() })}</p>

        <H4 className='mb-2'>{translationSvc.translate('UI.tutorial.title_tech')}</H4>
        <p className='paragraph mb-2'>{translationSvc.translate('UI.tutorial.article.p4')}</p>
        <p className='paragraph mb-3'>{translationSvc.translate('UI.tutorial.article.p5')}</p>
      </Article>
    );
  }

  getSecondPanel() {
    return (
      <Article className='page page--2 pb-2'>
        <H4 className='mb-2'>{translationSvc.translate('UI.tutorial.title_commands')}</H4>
        <H5 className='mt-2 mb-2 align-left'>{translationSvc.translate('UI.tutorial.subtitle_misc')}</H5>
        <Row>
          <Col className='flexcol--12-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialKey className='mb-2' name={Keys.reload} text={translationSvc.translate('UI.tutorial.key_reload')} />
              <TutorialKey className='mb-2' name={Keys.mute} text={translationSvc.translate('UI.tutorial.key_mute')} />
            </div>
          </Col>
          <Col className='flexcol--12-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialKey className='mb-2' name={translationSvc.translate('UI.tutorial.mouse_interaction_name')} text={translationSvc.translate('UI.tutorial.mouse_interaction')} />
              <TutorialKey className='mb-2' name={translationSvc.translate('UI.tutorial.key_menu_name')} text={translationSvc.translate('UI.tutorial.key_menu')} />
            </div>
          </Col>
          <Col className='flexcol--24'>
            <div className='tutorial-keys'>
              <TutorialKey className='mb-2' name={Keys.vocal} text={translationSvc.translate('UI.tutorial.key_vocal')} />
            </div>
          </Col>
        </Row>
        <H5 className='mt-2 mb-2 align-left'>{translationSvc.translate('UI.tutorial.subtitle_mvt')}</H5>
        <Row>
          <Col className='flexcol--12-t mb-2 mb-0-t'>
            <div className='tutorial-keys'>
              <TutorialKey className='mb-2' name={Keys.front} text={translationSvc.translate('UI.tutorial.key_front')} />
              <TutorialKey className='mb-2' name={Keys.back} text={translationSvc.translate('UI.tutorial.key_back')} />
              <TutorialKey className='mb-2' name={Keys.left} text={translationSvc.translate('UI.tutorial.key_left')} />
            </div>
          </Col>
          <Col className='flexcol--12-t'>
            <div className='tutorial-keys'>
              <TutorialKey className='mb-2' name={Keys.right} text={translationSvc.translate('UI.tutorial.key_right')} />
              <TutorialKey className='mb-2' name={Keys.up} text={translationSvc.translate('UI.tutorial.key_up')} />
              <TutorialKey className='mb-2' name={Keys.down} text={translationSvc.translate('UI.tutorial.key_down')} />
            </div>
          </Col>
        </Row>
      </Article>
    );
  }
}

export default Tutorial;
