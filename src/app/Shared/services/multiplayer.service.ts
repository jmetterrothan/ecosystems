import * as THREE from 'three';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import { ISocketRoomJoined, ISocketPositionUpdated, ISocketDisconnection, ISocketObjectAdded, ISocketObjectsInitialized } from '@shared/models/socketEvents.model';
import { IPick } from '@shared/models/pick.model';
import { IOnlineObject } from '@shared/models/onlineObjects.model';

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
  private objectsPlaced: IPick[] = [];

  private debugArea: HTMLElement;

  constructor() {
    this.debugArea = document.createElement('div');
    this.debugArea.classList.add('div', 'debug');
    document.body.appendChild(this.debugArea);

    this.objectPlacedSource = new Subject();
    this.objectPlaced$ = this.objectPlacedSource.asObservable();
  }

  init(scene: THREE.Scene, seed: string) {
    this.used = true;
    this.scene = scene;
    this.room = seed;

    const url: string = `${ENV.socketBaseUrl}:${ENV.socketPort}`;
    this.socket = io.connect(url);

    this.debugArea.innerHTML += `<h1>ROOM = ${this.room}</h1>`;

    this.socket.emit('join_room', this.room);

    this.handleServerInteraction();
  }

  isUsed(): boolean { return this.used; }

  sendPosition(position: THREE.Vector3) {
    if (this.onlineUsers.length) this.socket.emit('position', { position, room: this.room });
  }

  placeObject(item: IPick) {
    this.objectsPlaced.push(item);
    this.socket.emit('object', { item, room: this.room });
  }

  private handleServerInteraction() {
    this.socket.on('room_joined', (data: ISocketRoomJoined) => this.onRoomJoined(data));
    this.socket.on('objects_initialized', (data: ISocketObjectsInitialized) => this.onObjectsInitialized(data));
    this.socket.on('position_updated', (data: ISocketPositionUpdated) => this.onPositionupdated(data));
    this.socket.on('object_added', (data: ISocketObjectAdded) => this.onObjectAdded(data));
    this.socket.on('disconnection', (data: ISocketDisconnection) => this.onDisconnection(data));
  }

  private onRoomJoined(data: ISocketRoomJoined) {
    if (!this.userId && this.userId !== data.me) {
      this.userId = data.me;
      // this.debugArea.innerHTML += `<h1 style='color: blue'>You are : ${data.me}</h1>`;
    } else {
      this.socket.emit('objects_init', { room: this.room, objectsPlaced: this.objectsPlaced });
      // this.debugArea.innerHTML += `<h1 style='color: green'>${data.me} connected</h1>`;
    }

    const newUsers = data.usersConnected.filter(user => this.onlineUsers.indexOf(user) < 0 && user !== this.userId);

    newUsers.forEach(user => {
      this.createUserMesh(user);
      this.onlineUsers.push(user);
    });

    // this.debugArea.innerHTML += `<ul><li>${this.userId}</li>${this.onlineUsers.reverse().map(user => `<li>${user}</li>`)}-----------------------</ul>`;
  }

  private onObjectsInitialized(data: ISocketObjectsInitialized) {
    if (this.objectsPlaced.length) return;

    this.objectsPlaced = data.objectsPlaced;
    this.objectsPlaced.forEach((item: IPick) => {
      this.objectPlacedSource.next(<IOnlineObject>{ item, animate: false });
    });
  }

  private onPositionupdated(data: ISocketPositionUpdated) {
    const mesh = this.onlineUsersMeshes.find((mesh: THREE.Mesh) => mesh.userData.userID === data.userID);
    if (mesh) mesh.position.copy(data.position);
  }

  private onObjectAdded(data: ISocketObjectAdded) {
    this.objectsPlaced.push(data.item);
    this.objectPlacedSource.next(<IOnlineObject>{ item: data.item, animate: true });
  }

  private onDisconnection(data: ISocketDisconnection) {
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
