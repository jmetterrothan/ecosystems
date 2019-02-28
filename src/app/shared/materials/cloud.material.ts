import * as THREE from 'three';

export const CLOUD_MATERIAL: THREE.MeshLambertMaterial = new THREE.MeshLambertMaterial({
  wireframe: false,
  emissive: 0x000000,
  emissiveIntensity: 0,
  reflectivity: 0,
  flatShading: true,
  color: 0xffffff,
  opacity: 0.9,
  transparent: true,
  side: THREE.FrontSide,
});
