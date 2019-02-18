import { IPick } from '@world/models/pick.model';

export interface IOnlineObject {
  item?: IPick;
  object?: THREE.Object3D;
  animate: boolean;
  type: ONLINE_INTERACTION;
}

export enum ONLINE_INTERACTION {
  ADD,
  REMOVE
}
