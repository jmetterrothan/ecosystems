import { BehaviorSubject, Observable } from 'rxjs';

class UnderwaterService {

  private source: BehaviorSubject<boolean>;
  observable$: Observable<boolean>;

  underwater: boolean;

  constructor() {
    this.underwater = false;
    this.source = new BehaviorSubject<boolean>(false);
    this.observable$ = this.source.asObservable();
  }

  get isUnderwater(): boolean {
    return this.underwater;
  }

  set(value: boolean) {
    this.underwater = value;
    this.source.next(value);
  }

}

export const underwaterSvc = new UnderwaterService();
