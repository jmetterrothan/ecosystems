import { CrosshairState } from '@app/ui/enums/CrosshairState.enum';
export interface ICrosshairStatus {
  state: CrosshairState;
  show: boolean;
  shake: boolean;
}
