import * as THREE from 'three';

export const CLOUD_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0xffffff,
  emissiveIntensity: 0,
  shininess: 16,
  reflectivity: 0,
  flatShading: true,
  color: 0xffffff,
  opacity: 0.975,
  transparent: true,
  side: THREE.FrontSide,
});
