import React from 'react';

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
         {this.getOnlineShare()}
          <Article>
            <H4 className='mb-2'>{translationSvc.translate('UI.home-tab.article.title_project')}</H4>
            <p className='paragraph mb-2'>{translationSvc.translate('UI.home-tab.article.p1')}</p>
            <p className='paragraph mb-2'>{translationSvc.translate('UI.home-tab.article.p2', { count: Biomes.length })}</p>
            <p className='paragraph mb-3'>{translationSvc.translate('UI.home-tab.article.p3', { count: achievementSvc.getTrophiesCount() })}</p>

            <H4 className='mb-2'>{translationSvc.translate('UI.home-tab.article.title_tech')}</H4>
            <p className='paragraph mb-2'>{translationSvc.translate('UI.home-tab.article.p4')}</p>
            <p className='paragraph mb-3'>{translationSvc.translate('UI.home-tab.article.p5')}</p>
          </Article>
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
      <form className='form online-share mb-3'>
        <div className='form__group'>
          <p className='paragraph color-darkblue bold mb-1'>
            Vous pouvez partagez la session actuelle en envoyant le lien suivant :
          </p>
          <input type='text' className='form__element' readOnly={true} value={onlineShareLink} />
        </div>
      </form>
    );
  }
}

export default HomeTab;
