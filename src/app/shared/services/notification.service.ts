import { Observable, Subject } from 'rxjs';

import { INotification } from '@shared/models/notification.model';
import Lifo from '@shared/Lifo';

class NotificationService {
  public notifications$: Subject<INotification>;
  private stack: Lifo<INotification>;
  private time: number;

  constructor() {
    this.notifications$ = new Subject();
    this.stack = new Lifo<INotification>();
  }

  push(notification: INotification) {
    this.notifications$.next(notification);
    // this.stack.push(notification);
  }
}

export const notificationSvc = new NotificationService();

export default NotificationService;
