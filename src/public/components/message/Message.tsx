import React from 'react';
import classnames from 'classnames';

import { IOnlineUser } from '@app/online/models/onlineObjects.model';

import './message.styles.scss';

interface IMessageProps {
  id: number;
  user?: IOnlineUser;
  content: string;
}

const Message = ({ id, user, content }: IMessageProps) => {
  return (
    <p key={id} className='message'>
      {user && <span className='message__username' style={{ color: user.color }}>{`<${user.name}> `}</span>}
      <span className={classnames('message__text', !user && 'message__text--nouser')}>{content}</span>
    </p>
  );
};

export default Message;
