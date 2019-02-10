import React from 'react';
import classNames from 'classnames';

import './notification.styles';
interface INotificationProps {
  id: string;
  label: string;
  content: string;
  duration: number;
  icon?: string;
  style?: any;
}

class Notification extends React.Component<INotificationProps, any> {
  render() {
    const { style, label, content, icon } = this.props;
    const iconClass = icon != null ? `notification--${icon}` : '';

    return (
      <div style={style} className={classNames('notification', iconClass)}>
        <div className='notification__icon'><span className='icon-trophy'/></div>
        <div className='notification__text'>
          <div className='notification__label'>{label}</div>
          <div className='notification__content'>{content}</div>
        </div>
      </div>
    );
  }
}

export default Notification;
