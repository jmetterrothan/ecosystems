import * as THREE from 'three';
export interface ICloudData {
  particles: THREE.Geometry;
  particleMaterial: THREE.PointsMaterial;
  particleSystem: THREE.Points;
  isRaininig: boolean;
  allParticlesDropped: boolean;
  scale: THREE.Vector3;
  animating: boolean;
}
