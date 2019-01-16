import * as THREE from 'three';
export interface IEffect {
  effect: THREE.ShaderPass;
  update: Function;
}
