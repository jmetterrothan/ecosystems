import * as THREE from 'three';

export interface IOnlinePlayer {
  uniqid: string;
  position: THREE.Vector3;
  mesh: THREE.Mesh;
}
