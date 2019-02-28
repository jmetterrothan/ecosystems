import React from 'react';
import classnames from 'classnames';

import { translationSvc } from '@shared/services/translation.service';

import { IOnlineMessage, ONLINE_MESSAGE_TYPE } from '@app/online/models/onlineObjects.model';

import './message.styles.scss';

const UserMessage = ({ id, user, content }: IOnlineMessage) => {
  return (
    <p key={id} className='message message--user'>
      <span className='message__username' style={{ color: user.color }}>{`<${user.name}> `}</span>
      <span className={classnames('message__text')}>{content}</span>
    </p>
  );
};

const SystemMessage = ({ id, user, type }: IOnlineMessage) => {
  const key = type === ONLINE_MESSAGE_TYPE.CONNECTION ? 'connection' : 'disconnection';
  const text = translationSvc.translate(`UI.online.system_messages.${key}`, { user: user.name });
  return (
    <p key={id} className='message message--system'>
      <span className={classnames('message__text')}>{text}</span>
    </p>
  );
};

const Message = (message: IOnlineMessage) => {
  return message.type === ONLINE_MESSAGE_TYPE.USER ? <UserMessage {...message} /> : <SystemMessage {...message} />;
};

export default Message;
