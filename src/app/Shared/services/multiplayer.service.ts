import * as THREE from 'three';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import { ISocketRoomJoined } from '@shared/models/socketEvents.model';

import { ENV } from '@shared/env/env';

class MultiplayerService {

  private socket: SocketIOClient.Socket;

  // private source: Subject<string>;
  // multiplayerObservable: Observable<string>;

  private room: string;

  private userId: string;

  private onlineUsers: string[] = [];

  private debugArea: HTMLElement;

  constructor() {
    this.debugArea = document.createElement('div');
    this.debugArea.classList.add('div', 'debug');
    document.body.appendChild(this.debugArea);
    // this.source = new Subject<string>();
    // this.multiplayerObservable = this.sourcse.asObservable();
  }

  init(seed) {
    const url: string = `${ENV.socketBaseUrl}:${ENV.socketPort}`;

    this.room = seed;
    this.socket = io.connect(url);

    this.debugArea.innerHTML += `<h1>ROOM = ${this.room}</h1>`;

    this.socket.emit('room', this.room);

    this.socket.on('room_joined', (data: ISocketRoomJoined) => {
      if (this.userId !== data.id) {
        this.userId = data.id;
        this.debugArea.innerHTML += `<h1 style='color: blue'>You are ${data.id}</h1>`;
      }
      this.debugArea.innerHTML += `<h1>${data.userCount} users connected</h1>`;
    });

  }

}

export const multiplayerSvc = new MultiplayerService();
export default MultiplayerService;
