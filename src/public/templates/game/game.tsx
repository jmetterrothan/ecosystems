import React from 'react';
import { Subscription } from 'rxjs';
import classNames from 'classnames';

import UIManager from '@app/ui/UIManager';
import Crosshair from '@components/crosshair/crosshair';
import Chat from '@components/chat/Chat';
import { getKeyActionDisplayName } from '../menu/tutorial-tab/tutorial-action-key/tutorial-action-key';

import { achievementSvc } from '@achievements/services/achievement.service';
import { multiplayerSvc } from '@online/services/multiplayer.service';
import { configSvc } from '@shared/services/config.service';

import { IOnlineMessage, IOnlineStatus } from '@online/models/onlineObjects.model';
import { KeyAction } from '@app/shared/constants/keys.constants';

import './game.styles.scss';

interface IGameProps {
  uiManager: UIManager;
}

interface IGameState {
  unlockedTrophiesCount: number;
  trophiesCount: number;
  onlineStatus: IOnlineStatus;
  soundEnabled: boolean;
  voiceEnabled: boolean;
  chatOpened: boolean;
  messages: IOnlineMessage[];
}

class Game extends React.PureComponent<IGameProps, IGameState> {
  private trophySubscription: Subscription;
  private configSoundSubscription: Subscription;
  private configVoiceSubscription: Subscription;
  private onlineStatusSubscription: Subscription;
  private toggleChatSubscription: Subscription;
  private messagesSubscription: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      unlockedTrophiesCount: achievementSvc.getUnlockedTrophiesCount(),
      trophiesCount: achievementSvc.getTrophiesCount(),
      onlineStatus: multiplayerSvc.getOnlineStatus(),
      soundEnabled: configSvc.soundEnabled,
      voiceEnabled: configSvc.voiceEnabled,
      chatOpened: multiplayerSvc.chatInputIsFocused(),
      messages: multiplayerSvc.getMessages()
    };
  }

  componentDidMount() {
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

    if (multiplayerSvc.isUsed()) {
      this.toggleChatSubscription = multiplayerSvc.chatInputFocus$.subscribe(() => {
        const chatOpened = multiplayerSvc.chatInputIsFocused();
        this.setState({ chatOpened });
      });

      this.messagesSubscription = multiplayerSvc.messages$.subscribe((messages: IOnlineMessage[]) => {
        this.setState({ messages });
      });
    }
  }

  componentWillUnmount() {
    this.trophySubscription.unsubscribe();
    this.configSoundSubscription.unsubscribe();
    this.configVoiceSubscription.unsubscribe();
    this.onlineStatusSubscription.unsubscribe();
    if (multiplayerSvc.isUsed()) {
      this.toggleChatSubscription.unsubscribe();
      this.messagesSubscription.unsubscribe();
    }
  }

  render() {
    const { messages, chatOpened, onlineStatus, soundEnabled, voiceEnabled, unlockedTrophiesCount, trophiesCount } = this.state;

    const trophiesProgression = unlockedTrophiesCount * 100 / trophiesCount;

    const iconSoundClass = soundEnabled ? 'icon-volume-high' : 'icon-volume-mute2';
    const iconSoundActiveClass = soundEnabled ? 'overlay-icon--active' : '';

    const iconVoiceClass = voiceEnabled ? 'icon-radio-checked' : 'icon-radio-unchecked';
    const iconVoiceActiveClass = voiceEnabled ? 'overlay-icon--active' : '';

    const list = messages ? messages.slice(chatOpened ? -16 : -8).filter((message) => message && message.user) : [];

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
              <span className='overlay-icon__key'>{getKeyActionDisplayName(KeyAction.MUTE)}</span>
            </div>
            {/*
            <div className={classNames('overlay-icon overlay-icon--voice', iconVoiceActiveClass)}>
              <span className={classNames(iconVoiceClass, 'overlay-icon__icon')} />
              <span className='overlay-icon__key'>{getKeyActionDisplayName(KeyAction.VOCAL)}</span>
            </div>
            */}
          </div>
          <div className='overlay__chat'>
            {multiplayerSvc.isUsed() && <Chat messages={list} isOpened={chatOpened} onlineStatus={onlineStatus} />}
          </div>
        </div>
      </section>
    );
  }
}

export default Game;
