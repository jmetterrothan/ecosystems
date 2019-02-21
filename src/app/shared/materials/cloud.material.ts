import * as THREE from 'three';

export const CLOUD_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0xffffff,
  emissiveIntensity: 0,
  reflectivity: 0,
  flatShading: true,
  specular: 0x252525,
  color: 0xffffff,
  opacity: 0.8,
  transparent: true,
  side: THREE.FrontSide,
});
