import { Observable, Subject } from 'rxjs';

import { INotification } from '@shared/models/notification.model';
import Fifo from '@shared/Fifo';

class NotificationService {
  public notifications$: Subject<INotification>;
  private stack: Fifo<INotification>;
  private time: number;

  constructor() {
    this.notifications$ = new Subject();
    this.stack = new Fifo<INotification>();
  }

  push(notification: INotification) {

    /*
    *
    */

    this.stack.push(notification);
  }
}

export const notificationSvc = new NotificationService();

export default NotificationService;
