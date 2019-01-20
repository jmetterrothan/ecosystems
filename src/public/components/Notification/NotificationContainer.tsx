import React from 'react';
import { Subscription } from 'rxjs';

import Notification from '@public/components/Notification/Notification';
import { notificationSvc } from '@app/shared/services/notification.service';

import { INotification } from '@shared/models/notification.model';

interface INotificationContainerState {
  list: INotification[];
}

class NotificationContainer extends React.Component<any, INotificationContainerState> {
  private subscription: Subscription;

  constructor(props) {
    super(props);

    this.state = {
      list: []
    };
  }

  componentWillMount() {
    this.subscription = notificationSvc.notifications$.subscribe((notification) => this.add(notification));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  private add(notification: INotification) {
    const { list } = this.state;
    list.push(notification);

    setTimeout(() => {
      this.setState({ list: this.state.list.filter(n => n !== notification) });
    }, notification.duration);

    this.setState({ list });
  }

  render() {
    const { list } = this.state;

    return (
      <ul className='notification-container'>
        {list.map((notification, i) => <li key={i} className='mb-2'><Notification {...notification} /></li>)}
      </ul>
    );
  }
}

export default NotificationContainer;
