import React from 'react';
import classnames from 'classnames';

import { translationSvc } from '@shared/services/translation.service';

import { IOnlineMessage, ONLINE_MESSAGE_TYPE } from '@app/online/models/onlineObjects.model';

import './message.styles.scss';

const Message = ({ id, user, content, type }: IOnlineMessage) => {
  return (
    <p key={id} className='message'>
      {type === ONLINE_MESSAGE_TYPE.USER && <span className='message__username' style={{ color: user.color }}>{`<${user.name}> `}</span>}
      <span className={classnames('message__text', !user && 'message__text--nouser')}>
        {type === ONLINE_MESSAGE_TYPE.USER && content}
        {type === ONLINE_MESSAGE_TYPE.CONNECTION && translationSvc.translate('UI.online.system_messages.connection', { user: user.name })}
        {type === ONLINE_MESSAGE_TYPE.DISCONNECTION && translationSvc.translate('UI.online.system_messages.disconnection', { user: user.name })}
      </span>
    </p>
  );
};

export default Message;
