import React from 'react';
import { Subscription } from 'rxjs';
import classNames from 'classnames';

import UIManager from '@app/ui/UIManager';
import Crosshair from '@components/crosshair/crosshair';

import { achievementSvc } from '@achievements/services/achievement.service';
import { multiplayerSvc } from '@online/services/multiplayer.service';
import { translationSvc } from '@shared/services/translation.service';

import { IOnlineStatus } from '@online/models/onlineStatus.model';

import './game.styles.scss';
import { configSvc } from '@app/shared/services/config.service';

import { KeyAction, Keys } from '@shared/constants/keys.constants';

interface IGameProps {
  uiManager: UIManager;
}

interface IGameState {
  unlockedTrophiesCount: number;
  trophiesCount: number;
  onlineStatus: IOnlineStatus;
  soundEnabled: boolean;
  voiceEnabled: boolean;
}

class Game extends React.PureComponent<IGameProps, IGameState> {
  private trophySubscription: Subscription;
  private configSoundSubscription: Subscription;
  private configVoiceSubscription: Subscription;
  private onlineStatusSubscription: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      unlockedTrophiesCount: achievementSvc.getUnlockedTrophiesCount(),
      trophiesCount: achievementSvc.getTrophiesCount(),
      onlineStatus: multiplayerSvc.getOnlineStatus(),
      soundEnabled: configSvc.soundEnabled,
      voiceEnabled: configSvc.voiceEnabled
    };
  }

  componentWillMount() {
    this.trophySubscription = achievementSvc.trophy$.subscribe((count) => {
      this.setState({ unlockedTrophiesCount: count });
    });
    this.configSoundSubscription = configSvc.soundEnabled$.subscribe((b) => {
      this.setState({ soundEnabled: b });
    });
    this.configVoiceSubscription = configSvc.voiceEnabled$.subscribe((v) => {
      this.setState({ voiceEnabled: v });
    });
    this.onlineStatusSubscription = multiplayerSvc.onlineStatus$.subscribe((status) => {
      this.setState({ onlineStatus: status });
    });
  }

  componentWillUnmount() {
    this.trophySubscription.unsubscribe();
    this.configSoundSubscription.unsubscribe();
    this.configVoiceSubscription.unsubscribe();
    this.onlineStatusSubscription.unsubscribe();
  }

  render() {
    const { uiManager } = this.props;
    const { soundEnabled, voiceEnabled, unlockedTrophiesCount, trophiesCount, onlineStatus } = this.state;

    const trophiesProgression = unlockedTrophiesCount * 100 / trophiesCount;

    // online
    let onlineInfo = null;

    if (multiplayerSvc.isUsed()) {
      const pastilleClassnames = classNames('mr-1', 'pastille', onlineStatus.alive ? 'pastille--green' : 'pastille--red');

      onlineInfo = (
        <div className='overlay__online'>
          <span className={pastilleClassnames} />{translationSvc.translate('UI.online_count', { count: onlineStatus.online })}
        </div>
      );
    }

    const iconSoundClass = soundEnabled ? 'icon-volume-high' : 'icon-volume-mute2';
    const iconSoundActiveClass = soundEnabled ? 'overlay-icon--active' : '';

    const iconVoiceClass = voiceEnabled ? 'icon-radio-checked' : 'icon-radio-unchecked';
    const iconVoiceActiveClass = voiceEnabled ? 'overlay-icon--active' : '';

    return (
      <section className='ui__state game'>
        <div className='game__overlay overlay'>
          <Crosshair />
          <div className='overlay__trophies'>
            <div className='overlay-trophies mb-3'>
              <div className='overlay-trophies__icon'><span className='icon-trophy' /></div>
              <div className='overlay-trophies__counter counter'>
                <span className='counter__current'>{unlockedTrophiesCount}</span> / <span className='counter__total'>{trophiesCount}</span>
              </div>
              <div className='overlay-trophies__progression progression'>
                <div className='progression__inner' style={{ width: `${trophiesProgression}%` }} />
              </div>
            </div>
            <div className={classNames('overlay-icon overlay-icon--sound', iconSoundActiveClass)}>
              <span className={classNames(iconSoundClass, 'overlay-icon__icon')} />
              <span className='overlay-icon__key'>{Keys[KeyAction.MUTE]}</span>
            </div>
            <div className={classNames('overlay-icon overlay-icon--voice', iconVoiceActiveClass)}>
            <span className={classNames(iconVoiceClass, 'overlay-icon__icon')} />
              <span className='overlay-icon__key'>{Keys[KeyAction.VOCAL]}</span>
            </div>
          </div>
          <div className='overlay__seed'>
            Seed : {uiManager.state.parameters.seed}
          </div>
          {onlineInfo}
        </div>
      </section>
    );
  }
}

export default Game;
