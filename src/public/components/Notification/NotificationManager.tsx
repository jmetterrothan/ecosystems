import { Observable, Subject } from 'rxjs';

import { INotification } from '@shared/models/notification.model';

class NotificationManager {
  public notifications$: Subject<INotification>;

  constructor() {
    this.notifications$ = new Subject();
  }

  push(notification: INotification) {
    this.notifications$.next(notification);
  }
}

const manager = new NotificationManager();
export default manager;
