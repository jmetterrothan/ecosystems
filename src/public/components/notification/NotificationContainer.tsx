import React from 'react';
import { Subscription } from 'rxjs';
import { Spring, Transition } from 'react-spring';

import Notification from '@public/components/notification/Notification';
import { notificationSvc } from '@shared/services/notification.service';

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
      const newList = this.state.list.filter(n => n !== notification);
      this.setState({ list: newList });
    }, notification.duration);

    this.setState({ list });
  }

  render() {
    const { list } = this.state;

    return (
      <ul className='notification-container'>
        <Transition config={{ tension: 180, friction: 14 }} items={list} keys={item => item.id} from={{ transform: 'translateX(150%)' }} enter={{ transform: 'translateX(0%)' }} leave={{ transform: 'translateX(150%)' }}>
          {item => props => <li className='mb-2'><Notification style={props} {...item} /></li>}
        </Transition>
      </ul>
    );
  }
}

export default NotificationContainer;
