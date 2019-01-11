import { IPick } from './pick.model';
export interface ISocketRoomJoined {
  me: string;
  usersConnected: string[];
}

export interface ISocketPositionUpdated {
  userID: string;
  position: THREE.Vector3;
}

export interface ISocketObjectAdded {
  item: IPick;
}

export interface ISocketObjectsInitialized {
  objectsPlaced: IPick[];
}

export interface ISocketDisconnection {
  userID: string;
}
