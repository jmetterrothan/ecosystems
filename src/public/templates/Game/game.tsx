import React from 'react';
import { Subscription } from 'rxjs';

import { achievementSvc } from '@achievements/services/achievement.service';

interface IGameProps {

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
    const { unlockedTrophiesCount, trophiesCount } = this.state;
    const trophiesProgression = unlockedTrophiesCount * 100 / trophiesCount;
    return (
      <div className='ui-overlay'>
        <div className='ui-overlay__trophies'>
          <div className='counter mb-1'>
            <span className='counter__current'>{unlockedTrophiesCount}</span> / <span className='counter__total'>{trophiesCount}</span>
          </div>
          <div className='progression'>
            <div className='progression__inner' style={{ width: `${trophiesProgression}%` }} />
          </div>
        </div>
      </div>
    );
  }
}

export default Game;
