import React from 'react';
import Slider from 'react-slick';

import { H1, H2, H3, H4, H5 } from '@public/components/hx/hx';
import Article from '@public/components/article/article';
import UIManager from '@app/ui/UIManager';

import { translationSvc } from '@shared/services/translation.service';
import { Biomes } from '@app/world/constants/biomes.constants';
import { achievementSvc } from '@app/achievements/services/achievement.service';
import { multiplayerSvc } from '@app/online/services/multiplayer.service';

import './home-tab.styles';

type IProps = {
  uiManager: UIManager;
};

class HomeTab extends React.Component<IProps, any> {
  render() {
    return (
      <div className='tab home-tab'>
        <header className='tab__header'>
          <H1 className='color-theme mb-2 home-tab-title'>
            {multiplayerSvc.isUsed() && <span className='home-tab-title__legend color-theme'>Online</span>}
            {translationSvc.translate('UI.home-tab.title')}
          </H1>
        </header>
        <div className='tab__content'>
          {this.getSeedShare()}
          {this.getOnlineShare()}
          <Slider dots={true} vertical={false} infinite={false} speed={500} slidesToShow={1} slidesToScroll={1}>
            {this.getFirstPanel()}
            {this.getSecondPanel()}
          </Slider>
        </div>
      </div>
    );
  }

  getFirstPanel() {
    const options = { biomeCount: Biomes.length, trophyCount: achievementSvc.getTrophiesCount() };
    return (
      <Article>
        <H4 className='mb-2'>{translationSvc.translate('UI.home-tab.article.title_project')}</H4>
        <p className='paragraph mb-2'>{translationSvc.translate('UI.home-tab.article.p1')}</p>
        <H4 className='mb-2'>{translationSvc.translate('UI.home-tab.article.title_objectives')}</H4>
        <p className='paragraph mb-2'>{translationSvc.translate('UI.home-tab.article.p2', options)}</p>
        <H4 className='mb-2'>{translationSvc.translate('UI.home-tab.article.title_help')}</H4>
        <p className='paragraph mb-3'>{translationSvc.translate('UI.home-tab.article.p3', options)}</p>
      </Article>
    );
  }

  getSecondPanel() {
    return (
      <Article>
        <H4 className='mb-2'>{translationSvc.translate('UI.home-tab.article.title_tech')}</H4>
        <p className='paragraph mb-3'>{translationSvc.translate('UI.home-tab.article.p4')}</p>
        <p className='paragraph mb-1'>{translationSvc.translate('UI.home-tab.article.p5')} Threejs / Howler</p>
        <p className='paragraph mb-1'>{translationSvc.translate('UI.home-tab.article.p6')} Rxjs / React / i18next / SASS</p>
        <p className='paragraph mb-1'>{translationSvc.translate('UI.home-tab.article.p7')} Node.js / socket.io</p>
        {/* <p className='paragraph mb-3'>{translationSvc.translate('UI.home-tab.article.p8')} tensorflow / MongoDB</p> */}

        <H4 className='mb-2'>{translationSvc.translate('UI.home-tab.article.title_code')}</H4>
        <p className='paragraph mb-1'><a className='link' href='https://github.com/jmetterrothan/ecosystems'>GitHub Ecosystems</a></p>
        <p className='paragraph mb-1'><a className='link' href='https://github.com/jmetterrothan/ecosystems-server'>GitHub Ecosystems Server</a></p>
        <p className='paragraph mb-3'><a className='link' href='https://github.com/jmetterrothan/ecosystems-voice'>GitHub Ecosystems Voice</a></p>
      </Article>
    );
  }

  getSeedShare() {
    if (multiplayerSvc.isUsed()) { return null; }

    const { uiManager } = this.props;
    const seed = uiManager.state.parameters.seed;

    return (
      <div className='form online-share mb-3'>
        <div className='form__group'>
          <p className='paragraph color-darkblue bold mb-1'>
          {translationSvc.translate('UI.home-tab.seed')}
          </p>
          <input type='text' className='form__element' readOnly={true} value={seed} />
        </div>
      </div>
    );
  }

  getOnlineShare() {
    if (!multiplayerSvc.isUsed()) { return null; }

    const { uiManager } = this.props;

    const seed = encodeURI(uiManager.state.parameters.seed);
    const onlineShareLink = `https://www.3d-ecosystems.com/?online=1&seed=${seed}&share=1`;

    return (
      <div className='form online-share mb-3'>
        <div className='form__group'>
          <p className='paragraph color-darkblue bold mb-1'>
          {translationSvc.translate('UI.home-tab.share.text')}
          </p>
          <input type='text' className='form__element' readOnly={true} value={onlineShareLink} />
        </div>
      </div>
    );
  }
}

export default HomeTab;
