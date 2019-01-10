import * as THREE from 'three';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import { ENV } from '@shared/env/env';

class MultiplayerService {

  private socket: SocketIOClient.Socket;

  private source: Subject<string>;
  multiplayerObservable: Observable<string>;

  private room: string;

  constructor() {
    this.source = new Subject<string>();
    this.multiplayerObservable = this.source.asObservable();
  }

  init(seed) {
    const url: string = `${ENV.socketBaseUrl}:${ENV.socketPort}`;

    this.room = seed;
    this.socket = io.connect(url);

    this.socket.emit('room', this.room);

    this.socket.on('room_joined', userCount => {
      console.log('il y a', userCount, 'users');
    });

  }

}

export const multiplayerSvc = new MultiplayerService();
export default MultiplayerService;
