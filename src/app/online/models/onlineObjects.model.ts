import { IPick } from '@world/models/pick.model';

export interface IOnlineObject {
  item?: IPick;
  object?: THREE.Object3D;
  animate: boolean;
  type: ONLINE_INTERACTION;
}

export interface IOnlineStatus {
  online: number;
  alive: boolean;
}

export interface IOnlineUser {
  id: string;
  name: string;
  color: string;
}

export interface IOnlineMessage {
  type: ONLINE_MESSAGE_TYPE;
  id: number;
  user: IOnlineUser;
  content: string;
}

export enum ONLINE_MESSAGE_TYPE {
  USER = 'user',
  CONNECTION = 'connection',
  DISCONNECTION = 'disconnection'
}

export enum ONLINE_INTERACTION {
  ADD,
  REMOVE
}
