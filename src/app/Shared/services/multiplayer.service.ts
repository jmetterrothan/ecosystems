import * as THREE from 'three';

class MultiplayerService {

  private socket: WebSocket;

  private p2: THREE.Mesh;

  init(scene: THREE.Scene): Promise<any> {
    const port: number = 4200;
    const url: string = `ws://localhost:${port}`;

    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(url);

      this.socket.onopen = () => {
        const userID = `_${Math.random().toString(36).substring(2, 9)}`;
        console.log('userID', userID);
        resolve(this.socket);
      };
      this.socket.onerror = err => reject(err);
    });

  }

  update(position: THREE.Vector3) {
    this.socket.send(JSON.stringify(position));
  }

  private handlePosition() {
    this.socket.onmessage = message => {
      const position: THREE.Vector3 = JSON.parse(message.data);
      this.p2.position.copy(position);
    };
  }

  private createPlayer(scene: THREE.Scene) {
    this.p2 = new THREE.Mesh(new THREE.BoxGeometry(6000, 6000, 6000), new THREE.MeshBasicMaterial({ color: 'purple' }));
    scene.add(this.p2);
  }

}

export const multiplayerSvc = new MultiplayerService();
export default MultiplayerService;
