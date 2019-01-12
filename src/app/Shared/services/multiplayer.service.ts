import * as THREE from 'three';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import { ISocketDataRoomJoined, ISocketDataPositionUpdated, ISocketDataDisconnection, ISocketDataObjectAdded, ISocketDataObjectsInitialized } from '@app/Shared/models/SocketData.model';
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

  private room: string;
  private userId: string;

  private onlineUsers: string[] = [];
  private onlineUsersMeshes: THREE.Mesh[] = [];
  private placedObjects: IPick[] = [];

  private debugArea: HTMLElement;

  constructor() {
    this.debugArea = document.createElement('div');
    this.debugArea.classList.add('div', 'debug');
    document.body.appendChild(this.debugArea);

    this.objectPlacedSource = new Subject();
    this.objectPlaced$ = this.objectPlacedSource.asObservable();
  }

  /**
   * Init multiplayer with seed
   * @param {THREE.Scene} scene
   * @param {string} seed
   */
  init(scene: THREE.Scene, seed: string) {
    this.used = true;
    this.scene = scene;
    this.room = seed;

    const url: string = `${ENV.socketBaseUrl}:${ENV.socketPort}`;
    this.socket = io.connect(url);

    this.debugArea.innerHTML += `<h1>ROOM = ${this.room}</h1>`;

    this.socket.emit(SOCKET_EVENTS.CL_SEND_JOIN_ROOM, this.room);

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
    if (this.onlineUsers.length) this.socket.emit(SOCKET_EVENTS.CL_SEND_PLAYER_POSITION, { position, room: this.room });
  }

  /**
   * Send last object place by current player to server
   * @param {IPick} item
   */
  placeObject(item: IPick) {
    this.placedObjects.push(item);
    this.socket.emit(SOCKET_EVENTS.CL_SEND_ADD_OBJECT, { item, room: this.room });
  }

  /**
   * Listen events from server
   */
  private handleServerInteraction() {
    this.socket.on(SOCKET_EVENTS.SV_SEND_JOIN_ROOM, (data: ISocketDataRoomJoined) => this.onRoomJoined(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_INIT_OBJECTS, (data: ISocketDataObjectsInitialized) => this.onObjectsInitialized(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_PLAYER_POSITION, (data: ISocketDataPositionUpdated) => this.onPositionupdated(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_ADD_OBJECT, (data: ISocketDataObjectAdded) => this.onObjectAdded(data));
    this.socket.on(SOCKET_EVENTS.SV_SEND_DISCONNECTION, (data: ISocketDataDisconnection) => this.onDisconnection(data));
  }

  private onRoomJoined(data: ISocketDataRoomJoined) {
    if (!this.userId && this.userId !== data.me) {
      this.userId = data.me;
      // this.debugArea.innerHTML += `<h1 style='color: blue'>You are : ${data.me}</h1>`;
    } else {
      this.socket.emit(SOCKET_EVENTS.CL_SEND_INIT_OBJECTS, { room: this.room, placedObjects: this.placedObjects });
      // this.debugArea.innerHTML += `<h1 style='color: green'>${data.me} connected</h1>`;
    }

    const newUsers = data.usersConnected.filter(user => this.onlineUsers.indexOf(user) < 0 && user !== this.userId);

    newUsers.forEach(user => {
      this.createUserMesh(user);
      this.onlineUsers.push(user);
    });

    // this.debugArea.innerHTML += `<ul><li>${this.userId}</li>${this.onlineUsers.reverse().map(user => `<li>${user}</li>`)}-----------------------</ul>`;
  }

  private onObjectsInitialized(data: ISocketDataObjectsInitialized) {
    if (this.placedObjects.length) return;

    this.placedObjects = data.placedObjects;
    this.placedObjects.forEach((item: IPick) => {
      this.objectPlacedSource.next(<IOnlineObject>{ item, animate: false });
    });
  }

  private onPositionupdated(data: ISocketDataPositionUpdated) {
    const mesh = this.onlineUsersMeshes.find((mesh: THREE.Mesh) => mesh.userData.userID === data.userID);
    if (mesh) mesh.position.copy(data.position);
  }

  private onObjectAdded(data: ISocketDataObjectAdded) {
    this.placedObjects.push(data.item);
    this.objectPlacedSource.next(<IOnlineObject>{ item: data.item, animate: true });
  }

  private onDisconnection(data: ISocketDataDisconnection) {
    if (this.onlineUsers.includes(data.userID)) {
      // this.debugArea.innerHTML += `<h1 style='color: red'>${data.userID} disconnected</h1>`;
      // remove mesh
      const userIndex = this.onlineUsers.indexOf(data.userID);
      const userMeshIndex = this.onlineUsersMeshes.findIndex((mesh: THREE.Mesh) => mesh.userData.userID === data.userID);

      this.scene.remove(this.onlineUsersMeshes[userMeshIndex]);
      this.onlineUsers.splice(userIndex, 1);
      this.onlineUsersMeshes.splice(userMeshIndex, 1);
    }
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
