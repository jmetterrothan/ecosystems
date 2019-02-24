import * as THREE from 'three';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import World from '@world/World';

import { progressionSvc } from '@achievements/services/progression.service';

import { ISocketDataRoomJoined, ISocketDataPositionUpdated, ISocketDataDisconnection, ISocketDataObjectAdded, ISocketDataObjectRemoved } from '@online/models/socketData.model';
import { IPick } from '@world/models/pick.model';
import { IOnlineStatus } from '@online/models/onlineStatus.model';
import { IOnlineObject, ONLINE_INTERACTION } from '@online/models/onlineObjects.model';

import { SOCKET_EVENTS } from '@online/constants/socketEvents.constants';
import { PROGRESSION_ONLINE_STORAGE_KEYS } from '@achievements/constants/progressionOnlineStorageKeys.constants';

import { ENV } from '@shared/env/env';
import CommonUtils from '@app/shared/utils/Common.utils';

class MultiplayerService {

  private socket: SocketIOClient.Socket;
  private scene: THREE.Scene;
  private used: boolean = false;

  private objectInteractionSource: Subject<IOnlineObject>;
  objectInteraction$: Observable<IOnlineObject>;

  private timeSource: Subject<number>;
  time$: Observable<number>;

  private roomID: string;
  private userId: string;

  private alive: boolean;

  private onlineUsers: Map<string, THREE.Object3D>;
  onlineStatus$: Subject<IOnlineStatus>;

  constructor() {
    this.objectInteractionSource = new Subject();
    this.objectInteraction$ = this.objectInteractionSource.asObservable();

    this.timeSource = new Subject();
    this.time$ = this.timeSource.asObservable();

    this.onlineUsers = new Map();
    this.onlineStatus$ = new Subject();

    this.alive = true;
  }

  /**
   * Init multiplayer with seed
   * @param {THREE.Scene} scene
   * @param {string} seed
   */
  init(scene: THREE.Scene, seed: string) {
    this.used = true;
    this.scene = scene;
    this.roomID = seed;

    const url: string = CommonUtils.isDev()
      ? `${ENV.socketBaseUrl}:${ENV.socketPort}`
      : `${ENV.socketBaseUrl}`;

    this.socket = io.connect(url);

    this.socket.emit(SOCKET_EVENTS.CL_SEND_JOIN_ROOM, this.roomID);

    this.handleServerInteraction();
  }

  /**
   * Returns if multiplayer service is used
   * @returns {boolean}
   */
  isUsed(): boolean { return this.used; }

  /**
   * Send current player position to server
   * @param {THREE.Vector3} position
   */
  sendPosition(position: THREE.Vector3) {
    if (this.onlineUsers.size) this.socket.emit(SOCKET_EVENTS.CL_SEND_PLAYER_POSITION, { position, roomID: this.roomID });
  }

  checkStatus() {
    if (this.socket.connected !== this.alive) {
      this.alive = this.socket.connected;
      this.onlineStatus$.next(this.getOnlineStatus());
    }
  }

  /**
   * Send last object placed by current player to server
   * @param {IPick} item
   */
  placeObject(item: IPick) {
    this.socket.emit(SOCKET_EVENTS.CL_SEND_ADD_OBJECT, { item, roomID: this.roomID });
  }

  /**
   * Send last object removed by player to server
   * @param {THREE.Object3D} object
   */
  removeObject(object: THREE.Object3D) {
    this.socket.emit(SOCKET_EVENTS.CL_SEND_REMOVE_OBJECT, { object, roomID: this.roomID });
  }

  /**
   * Listen events from server
   */
  private handleServerInteraction() {
    this.socket.on(SOCKET_EVENTS.SV_SEND_JOIN_ROOM, (data: ISocketDataRoomJoined) => this.onRoomJoined(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_PLAYER_POSITION, (data: ISocketDataPositionUpdated) => this.onPositionupdated(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_ADD_OBJECT, (data: ISocketDataObjectAdded) => this.onObjectAdded(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_REMOVE_OBJECT, (data: ISocketDataObjectRemoved) => this.onObjectRemoved(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_DISCONNECTION, (data: ISocketDataDisconnection) => this.onDisconnection(data));
  }

  private onRoomJoined(data: ISocketDataRoomJoined) {
    if (!this.userId && this.userId !== data.me) {
      this.userId = data.me;

      if (data.usersConnected.length === 1) progressionSvc.increment(PROGRESSION_ONLINE_STORAGE_KEYS.create_game_online);

      // place all objects already placed on this room
      data.objectsAdded.forEach((item: IPick) => {
        this.objectInteractionSource.next(<IOnlineObject>{ item, type: ONLINE_INTERACTION.ADD, animate: false });
      });
      // remove objects
      data.objectsRemoved.forEach(obj => {
        const object = new THREE.ObjectLoader().parse(obj);
        this.objectInteractionSource.next(<IOnlineObject>{ object, type: ONLINE_INTERACTION.REMOVE, animate: false });
      });
    }

    // share time
    this.timeSource.next(data.startTime);

    if (this.userId === data.me && data.usersConnected.length > 1) {
      progressionSvc.increment(PROGRESSION_ONLINE_STORAGE_KEYS.join_game_online);
    }

    // init mesh for each new users
    data.usersConnected.forEach((user: string) => {
      if (!this.onlineUsers.has(user) && user !== this.userId) {
        const userMesh = this.createUserMesh(user);

        this.onlineUsers.set(user, userMesh);
        this.scene.add(userMesh);

        this.onlineStatus$.next(this.getOnlineStatus());
      }
    });

  }

  private onPositionupdated(data: ISocketDataPositionUpdated) {
    const mesh = this.onlineUsers.get(data.userID);
    mesh.position.copy(data.position);
  }

  private onObjectAdded(data: ISocketDataObjectAdded) {
    this.objectInteractionSource.next(<IOnlineObject>{ type: ONLINE_INTERACTION.ADD, item: data.item, animate: true });
  }

  private onObjectRemoved(data: ISocketDataObjectRemoved) {
    const object = new THREE.ObjectLoader().parse(data.object);
    this.objectInteractionSource.next(<IOnlineObject>{ object, type: ONLINE_INTERACTION.REMOVE, animate: true });
  }

  private onDisconnection(data: ISocketDataDisconnection) {
    // remove mesh from scene
    const user = this.onlineUsers.get(data.userID);
    this.scene.remove(user);
    this.onlineUsers.delete(data.userID);

    this.onlineStatus$.next(this.getOnlineStatus());
  }

  private createUserMesh(userID: string): THREE.Object3D {
    const user = World.LOADED_MODELS.get('player').clone();
    user.userData = { userID };

    user.position.set(this.onlineUsers.size * 3000, 10000, 0);
    return user;
  }

  getOnlineUsersCount(): number {
    return this.onlineUsers.size + 1;
  }

  getOnlineStatus(): IOnlineStatus {
    return {
      alive: this.alive,
      online: this.getOnlineUsersCount()
    };
  }
}

export const multiplayerSvc = new MultiplayerService();
export default MultiplayerService;
