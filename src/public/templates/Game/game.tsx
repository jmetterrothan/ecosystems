import React from 'react';
import { Subscription } from 'rxjs';

import UIManager from '@app/ui/UIManager';

import { achievementSvc } from '@achievements/services/achievement.service';

interface IGameProps {
  uiManager: UIManager;
}

interface IGameState {
  unlockedTrophiesCount: number;
  trophiesCount: number;
}

class Game extends React.PureComponent<IGameProps, IGameState> {
  private subscription: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      unlockedTrophiesCount: achievementSvc.getUnlockedTrophiesCount(),
      trophiesCount: achievementSvc.getTrophiesCount()
    };
  }

  componentWillMount() {
    this.subscription = achievementSvc.trophy$.subscribe((count) => {
      this.setState({ unlockedTrophiesCount: count });
    });
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  render() {
    const { uiManager } = this.props;
    const { unlockedTrophiesCount, trophiesCount } = this.state;
    const trophiesProgression = unlockedTrophiesCount * 100 / trophiesCount;

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
      </div>
    );
  }
}

export default Game;
