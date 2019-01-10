import * as THREE from 'three';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import { ISocketRoomJoined, ISocketPositionUpdated, ISocketDisconnection } from '@shared/models/socketEvents.model';

import { ENV } from '@shared/env/env';

class MultiplayerService {

  private socket: SocketIOClient.Socket;
  private scene: THREE.Scene;

  private used: boolean = false;
  // private source: Subject<string>;
  // multiplayerObservable: Observable<string>;

  private room: string;
  private userId: string;

  private onlineUsers: string[] = [];
  private onlineUsersMeshes: THREE.Mesh[] = [];

  private debugArea: HTMLElement;

  constructor() {
    this.debugArea = document.createElement('div');
    this.debugArea.classList.add('div', 'debug');
    document.body.appendChild(this.debugArea);
  }

  init(scene: THREE.Scene, seed: string) {
    this.used = true;
    this.scene = scene;
    this.room = seed;

    const url: string = `${ENV.socketBaseUrl}:${ENV.socketPort}`;
    this.socket = io.connect(url, { secure: true });

    console.log(this.socket);

    this.debugArea.innerHTML += `<h1>ROOM = ${this.room}</h1>`;

    this.socket.emit('join_room', this.room);

    this.handleServerInteraction();
  }

  isUsed(): boolean { return this.used; }

  sendPosition(position: THREE.Vector3) {
    if (this.onlineUsers.length) this.socket.emit('position', { position, room: this.room });
  }

  private handleServerInteraction() {
    this.socket.on('room_joined', (data: ISocketRoomJoined) => {
      if (!this.userId && this.userId !== data.me) {
        this.userId = data.me;
        this.debugArea.innerHTML += `<h1 style='color: blue'>You are : ${data.me}</h1>`;
      } else {
        this.debugArea.innerHTML += `<h1 style='color: green'>${data.me} connected</h1>`;
      }

      const newUsers = data.usersConnected.filter(user => this.onlineUsers.indexOf(user) < 0 && user !== this.userId);

      newUsers.forEach(user => {
        this.createUserMesh(user);
        this.onlineUsers.push(user);
      });

      this.debugArea.innerHTML += `<ul><li>${this.userId}</li>${this.onlineUsers.reverse().map(user => `<li>${user}</li>`)}-----------------------</ul>`;
    });

    this.socket.on('position_updated', (data: ISocketPositionUpdated) => {
      const mesh = this.onlineUsersMeshes.find((mesh: THREE.Mesh) => mesh.userData.userID === data.userID);
      if (mesh) mesh.position.copy(data.position);
    });

    this.socket.on('disconnection', ({ userID }: ISocketDisconnection) => {
      if (this.onlineUsers.includes(userID)) {
        this.debugArea.innerHTML += `<h1 style='color: red'>${userID} disconnected</h1>`;
        // remove mesh
        const userIndex = this.onlineUsers.indexOf(userID);
        const userMeshIndex = this.onlineUsersMeshes.findIndex((mesh: THREE.Mesh) => mesh.userData.userID === userID);

        this.scene.remove(this.onlineUsersMeshes[userMeshIndex]);
        this.onlineUsers.splice(userIndex, 1);
        this.onlineUsersMeshes.splice(userMeshIndex, 1);

        console.log(this.onlineUsersMeshes, userID);
      }
    });

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
