import { CROSSHAIR_STATES } from '@app/ui/enums/CrosshairState.enum';
export interface ICrosshairStatus {
  state: CROSSHAIR_STATES;
  show: boolean;
  shake: boolean;
}
