
import * as THREE from 'three';
export interface IMesh {
  getY(x?: number, z?: number): number;
  getMaterial(): THREE.Material;
}
