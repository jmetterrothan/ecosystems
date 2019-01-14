import { IPick } from '@world/models/pick.model';

export interface ISocketDataRoomJoined {
  me: string;
  usersConnected: string[];
  allObjects: IPick[];
  startTime: number;
}

export interface ISocketDataPositionUpdated {
  userID: string;
  position: THREE.Vector3;
}

export interface ISocketDataObjectAdded {
  item: IPick;
}

export interface ISocketDataObjectsInitialized {
  placedObjects: IPick[];
}

export interface ISocketDataDisconnection {
  userID: string;
}
