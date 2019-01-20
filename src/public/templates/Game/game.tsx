import React from 'react';
import { Subscription } from 'rxjs';
import classNames from 'classnames';

import UIManager from '@app/ui/UIManager';

import { achievementSvc } from '@achievements/services/achievement.service';
import { multiplayerSvc } from '@online/services/multiplayer.service';
import { translationSvc } from '@shared/services/translation.service';

import { IOnlineStatus } from '@online/models/onlineStatus.model';

interface IGameProps {
  uiManager: UIManager;
}

interface IGameState {
  unlockedTrophiesCount: number;
  trophiesCount: number;
  onlineStatus: IOnlineStatus;
}

class Game extends React.PureComponent<IGameProps, IGameState> {
  private trophySubscription: Subscription;
  private onlineStatusSubscription: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      unlockedTrophiesCount: achievementSvc.getUnlockedTrophiesCount(),
      trophiesCount: achievementSvc.getTrophiesCount(),
      onlineStatus: multiplayerSvc.getOnlineStatus()
    };
  }

  componentWillMount() {
    this.trophySubscription = achievementSvc.trophy$.subscribe((count) => {
      this.setState({ unlockedTrophiesCount: count });
    });
    this.onlineStatusSubscription = multiplayerSvc.onlineStatus$.subscribe((status) => {
      this.setState({ onlineStatus: status });
    });
  }

  componentWillUnmount() {
    this.trophySubscription.unsubscribe();
    this.onlineStatusSubscription.unsubscribe();
  }

  render() {
    const { uiManager } = this.props;
    const { unlockedTrophiesCount, trophiesCount, onlineStatus } = this.state;
    const trophiesProgression = unlockedTrophiesCount * 100 / trophiesCount;

    // online
    let onlineInfo = null;

    if (multiplayerSvc.isUsed()) {
      const pastilleClassnames = classNames('mr-1', 'ui-pastille', onlineStatus.alive ? 'ui-pastille--green' : 'ui-pastille--red');

      onlineInfo = (
        <div className='ui-overlay__online'>
          <span className={pastilleClassnames} />{translationSvc.translate('UI.online_count', { count: onlineStatus.online })}
        </div>
      );
    }

    return (
      <div className='ui-overlay'>
        <div className='ui-overlay__trophies'>
          <div className='ui-counter mb-1'>
            <span className='ui-counter__current'>{unlockedTrophiesCount}</span> / <span className='ui-counter__total'>{trophiesCount}</span>
          </div>
          <div className='ui-progression'>
            <div className='ui-progression__inner' style={{ width: `${trophiesProgression}%` }} />
          </div>
        </div>
        <div className='ui-overlay__seed'>
          Seed : {uiManager.state.parameters.seed}
        </div>
        {onlineInfo}
      </div>
    );
  }
}

export default Game;
