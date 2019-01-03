import * as THREE from 'three';
export interface Effect
{
  effect: THREE.ShaderPass;
  update: Function;
}
