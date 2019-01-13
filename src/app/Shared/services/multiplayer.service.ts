import * as THREE from 'three';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import { ISocketDataRoomJoined, ISocketDataPositionUpdated, ISocketDataDisconnection, ISocketDataObjectAdded, ISocketDataObjectsInitialized } from '@app/Shared/models/socketData.model';
import { IPick } from '@shared/models/pick.model';
import { IOnlineObject } from '@shared/models/onlineObjects.model';

import { SOCKET_EVENTS } from '@shared/constants/socketEvents.constants';

import { ENV } from '@shared/env/env';

class MultiplayerService {

  private socket: SocketIOClient.Socket;
  private scene: THREE.Scene;
  private used: boolean = false;

  private objectPlacedSource: Subject<IOnlineObject>;
  objectPlaced$: Observable<IOnlineObject>;

  private timeSource: Subject<number>;
  time$: Observable<number>;

  private roomID: string;
  private userId: string;

  private onlineUsers: string[] = [];
  private onlineUsersMeshes: THREE.Mesh[] = [];

  constructor() {
    this.objectPlacedSource = new Subject();
    this.objectPlaced$ = this.objectPlacedSource.asObservable();

    this.timeSource = new Subject();
    this.time$ = this.timeSource.asObservable();
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

    const url: string = `${ENV.socketBaseUrl}:${ENV.socketPort}`;
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
    if (this.onlineUsers.length) this.socket.emit(SOCKET_EVENTS.CL_SEND_PLAYER_POSITION, { position, roomID: this.roomID });
  }

  /**
   * Send last object place by current player to server
   * @param {IPick} item
   */
  placeObject(item: IPick) {
    // this.placedObjects.push(item);
    this.socket.emit(SOCKET_EVENTS.CL_SEND_ADD_OBJECT, { item, roomID: this.roomID });
  }

  /**
   * Listen events from server
   */
  private handleServerInteraction() {
    this.socket.on(SOCKET_EVENTS.SV_SEND_JOIN_ROOM, (data: ISocketDataRoomJoined) => this.onRoomJoined(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_PLAYER_POSITION, (data: ISocketDataPositionUpdated) => this.onPositionupdated(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_ADD_OBJECT, (data: ISocketDataObjectAdded) => this.onObjectAdded(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_DISCONNECTION, (data: ISocketDataDisconnection) => this.onDisconnection(data));
  }

  private onRoomJoined(data: ISocketDataRoomJoined) {
    if (!this.userId && this.userId !== data.me) {
      this.userId = data.me;

      // place all objects already placed on this room
      console.log('me', data);
      data.allObjects.forEach((item: IPick) => {
        this.objectPlacedSource.next(<IOnlineObject>{ item, animate: false });
      });
    }

    // share time
    this.timeSource.next(data.startTime);

    // init mesh for each new users
    const newUsers = data.usersConnected.filter(user => this.onlineUsers.indexOf(user) < 0 && user !== this.userId);
    newUsers.forEach(user => {
      this.createUserMesh(user);
      this.onlineUsers.push(user);
    });

  }

  private onPositionupdated(data: ISocketDataPositionUpdated) {
    const mesh = this.onlineUsersMeshes.find((mesh: THREE.Mesh) => mesh.userData.userID === data.userID);
    if (mesh) mesh.position.copy(data.position);
  }

  private onObjectAdded(data: ISocketDataObjectAdded) {
    this.objectPlacedSource.next(<IOnlineObject>{ item: data.item, animate: true });
  }

  private onDisconnection(data: ISocketDataDisconnection) {
    // remove mesh
    const userIndex = this.onlineUsers.indexOf(data.userID);
    const userMeshIndex = this.onlineUsersMeshes.findIndex((mesh: THREE.Mesh) => mesh.userData.userID === data.userID);

    this.scene.remove(this.onlineUsersMeshes[userMeshIndex]);
    this.onlineUsers.splice(userIndex, 1);
    this.onlineUsersMeshes.splice(userMeshIndex, 1);
  }

  private createUserMesh(userID: string) {
    const user = new THREE.Mesh(
      new THREE.SphereGeometry(3000, 24, 24),
      new THREE.MeshBasicMaterial({ color: new THREE.Color() })
    );
    user.userData = { userID };
    this.onlineUsersMeshes.push(user);
    user.position.set(this.onlineUsersMeshes.length * 3000, 10000, 0);
    this.scene.add(user);
  }

}

export const multiplayerSvc = new MultiplayerService();
export default MultiplayerService;
