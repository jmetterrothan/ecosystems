import React from 'react';
import { Subscription } from 'rxjs';
import classNames from 'classnames';

import Message from '@components/message/Message';

import { IOnlineMessage, IOnlineStatus } from '@online/models/onlineObjects.model';

import { translationSvc } from '@shared/services/translation.service';
import { multiplayerSvc } from '@online/services/multiplayer.service';

import './chat.styles.scss';

type IChatProps = {
  isOpened: boolean;
  messages: IOnlineMessage[];
  onlineStatus: IOnlineStatus;
};

type IchatState = {
  messageValue: string;
};

class Chat extends React.Component<IChatProps, IchatState> {
  private messageInput: HTMLInputElement;
  private toggleChatSubscription: Subscription;

  constructor(props) {
    super(props);
    this.state = {
      messageValue: ''
    };
  }

  componentDidMount() {
    if (multiplayerSvc.chatInputIsFocused()) this.messageInput.focus();

    this.toggleChatSubscription = multiplayerSvc.chatInputFocus$.subscribe(() => {
      const chatOpened = multiplayerSvc.chatInputIsFocused();
      if (chatOpened) setTimeout(() => this.messageInput.focus(), 10);
      else setTimeout(() => this.messageInput.blur(), 10);
    });
  }

  componentWillUnmount() {
    this.toggleChatSubscription.unsubscribe();
  }

  messageChange = ev => {
    this.setState({ messageValue: ev.target.value });
  }

  submitMessage = ev => {
    ev.preventDefault();

    const { messageValue } = this.state;
    if (messageValue.length) multiplayerSvc.sendMessage(messageValue);
    this.setState({ messageValue: '' });
  }

  render() {
    const { isOpened, messages, onlineStatus  } = this.props;

    const pastilleClassnames = classNames('mr-1', 'pastille', onlineStatus.alive ? 'pastille--green' : 'pastille--red');

    return (
      <div className={classNames('chat', isOpened && 'chat--active')}>
        <p className='chat__status mb-2'>
          <span className={pastilleClassnames} />{translationSvc.translate('UI.online.count', { count: onlineStatus.online })}
        </p>
        <div className='chat__container'>
          <div className='chat__messages'>
            {messages.map(item => <Message key={item.id} {...item} />)}
          </div>
          {<form className='chat__form mt-2' onSubmit={this.submitMessage}>
            <input type='text' className='input-message' value={this.state.messageValue} onChange={this.messageChange} ref={el => this.messageInput = el} placeholder='Ecrire dans le chat' />
          </form>}
        </div>
      </div>
    );
  }
}

export default Chat;
