import { IOnlineUser, IOnlineMessage } from '@online/models/onlineObjects.model';
import { IPick } from '@world/models/pick.model';

export interface ISocketDataRoomJoined {
  me: IOnlineUser;
  usersConnected: IOnlineUser[];
  objectsAdded: IPick[];
  objectsRemoved: THREE.Object3D[];
  startTime: number;
  messages: IOnlineMessage[];
}

export interface ISocketDataPositionUpdated {
  userID: string;
  position: THREE.Vector3;
}

export interface ISocketDataObjectAdded {
  item: IPick;
}

export interface ISocketDataObjectRemoved {
  object: THREE.Object3D;
}

export interface ISocketDataObjectsInitialized {
  placedObjects: IPick[];
}

export interface ISocketDataDisconnection {
  userID: string;
  messages: IOnlineMessage[];
}
