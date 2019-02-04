import React from 'react';
import { Subscription } from 'rxjs';
import { Spring, Transition } from 'react-spring';

import Lifo from '@app/shared/Lifo';
import SoundManager from '@app/shared/SoundManager';

import Notification from '@public/components/notification/Notification';
import { notificationSvc } from '@shared/services/notification.service';

import { INotification } from '@shared/models/notification.model';

interface INotificationContainerState {
  list: INotification[];
}

class NotificationContainer extends React.Component<any, INotificationContainerState> {
  private subscription: Subscription;
  private queue: Lifo<INotification>;
  private time: number;
  private timer: any;

  constructor(props) {
    super(props);

    this.queue = new Lifo<INotification>();
    this.time = -1;
    this.timer = null;

    this.state = {
      list: []
    };
  }

  componentWillMount() {
    this.subscription = notificationSvc.notifications$.subscribe((notification) => this.schedule(notification));
  }

  componentWillUnmount() {
    this.subscription.unsubscribe();
  }

  private add(notification: INotification) {
    const { list } = this.state;
    list.push(notification);

    // schedule removal
    setTimeout(() => {
      const newList = this.state.list.filter(n => n !== notification);
      this.setState({ list: newList });
    }, notification.duration);

    // add to active notification list
    this.setState({ list }, () => {
      SoundManager.play(Math.random() > 0.05 ? 'trophy_unlock' : 'hehe');
    });
  }

  private schedule(notification: INotification) {
    const now = window.performance.now();

    if (this.time === -1 || now >= this.time) {
      // notification list is clear or enough time has passed
      this.time = now + notification.duration / 2;
      this.add(notification);
    } else {
      // queue notification if the last notification was sent too recently & try again in 500 ms
      this.queue.push(notification);

      this.timer = setTimeout(() => {
        this.updateQueue();
      }, 500);
    }
  }

  private updateQueue() {
    if (!this.queue.isEmpty()) {
      const obj = this.queue.pop();
      this.schedule(obj);
    }
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
