import { Subject } from 'rxjs';

import { CROSSHAIR_STATES } from '@app/ui/enums/CrosshairState.enum';
import { ICrosshairStatus } from '@shared/models/crosshair.model';

class CrosshairService {
  public status$: Subject<ICrosshairStatus>;
  private currentStatus: ICrosshairStatus;
  private shaking: boolean;

  constructor() {
    this.status$ = new Subject();

    this.status = {
      state: CROSSHAIR_STATES.DEFAULT,
      show: false,
      shake: false
    };

    this.shaking = false;
  }

  shake(b: boolean) {
    if (!this.shaking) {
      if (b) {
        this.shaking = true;
        setTimeout(() => {
          this.shaking = false;
          this.shake(false);
        }, 500);
      }

      this.status = {
        ...this.status,
        shake: b,
      };
    }
  }

  show(b: boolean) {
    this.status = {
      ...this.status,
      show: b,
    };
  }

  switch(v: CROSSHAIR_STATES) {
    this.status = {
      ...this.status,
      state: v,
    };
  }

  get status() {
    return this.currentStatus;
  }

  set status(status) {
    this.currentStatus = status;
    this.status$.next(status);
  }
}

export const crosshairSvc = new CrosshairService();
export default CrosshairService;
