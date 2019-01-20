import { Observable, Subject } from 'rxjs';

import { INotification } from '@shared/models/notification.model';

class NotificationService {
  public notifications$: Subject<INotification>;

  constructor() {
    this.notifications$ = new Subject();
  }

  push(notification: INotification) {
    this.notifications$.next(notification);
  }
}

export const notificationSvc = new NotificationService();

export default NotificationService;
