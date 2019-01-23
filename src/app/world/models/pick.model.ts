import * as THREE from 'three';
export interface IPick {
  p: THREE.Vector3; // position
  r: THREE.Euler; // rotation
  s: THREE.Vector3; // scale
  f: boolean; // float flag
  n: string; // model name
}
