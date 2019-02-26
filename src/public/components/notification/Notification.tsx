import React from 'react';
import classNames from 'classnames';

import './notification.styles';
interface INotificationProps {
  id: string;
  label: string;
  content: string;
  duration: number;
  Icon?: any;
  style?: any;
}

class Notification extends React.Component<INotificationProps, any> {
  render() {
    const { style, label, content, Icon } = this.props;

    return (
      <div style={style} className={classNames('notification')}>
        <div className='notification__icon'>
          {Icon && <Icon />}
        </div>
        <div className='notification__text'>
          <div className='notification__label'>{label}</div>
          <div className='notification__content'>{content}</div>
        </div>
      </div>
    );
  }
}

export default Notification;
