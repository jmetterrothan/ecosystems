import * as THREE from 'three';
import * as io from 'socket.io-client';
import { Observable, Subject } from 'rxjs';

import { IOnlinePlayer } from '@shared/models/onlinePlayer.model';

import { ENV } from '@shared/env/env';

class MultiplayerService {

  private socket: SocketIOClient.Socket;

  private p2: THREE.Mesh;

  private source: Subject<string>;
  multiplayerObservable: Observable<string>;

  constructor() {
    this.source = new Subject<string>();
    this.multiplayerObservable = this.source.asObservable();
  }

  init(seed): Promise<any> {
    const port: number = 4200;
    const url: string = `${ENV.socketBaseUrl}:${ENV.socketPort}`;

    this.socket = io.connect(url);

    this.socket.emit('room', seed);

    /*     return new Promise((resolve, reject) => {
          this.socket = io.connect(url);

          this.socket.on('connect', () => {
            this.handleServer();
            resolve(this.socket);
          });

          this.socket.on('connect_error', err => {
            reject(err);
          });
        }); */
  }

  update(players: IOnlinePlayer[]) {
    // this.socket.emit('broadcast', { players });
  }

  private handleServer() {
    this.socket.on('user_id', data => {
      if (this.userId !== data) {
        this.userId = data;
        this.source.next(data);
      }
    });

    this.socket.on('update_position', players => {
      console.log('update', players);
    });
  }

  private createPlayer(scene: THREE.Scene) {
    this.p2 = new THREE.Mesh(new THREE.BoxGeometry(6000, 6000, 6000), new THREE.MeshBasicMaterial({ color: 'purple' }));
    scene.add(this.p2);
  }

}

export const multiplayerSvc = new MultiplayerService();
export default MultiplayerService;
