import * as THREE from 'three';
/*
export const TERRAIN_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0xffffff,
  emissiveIntensity: 0.05,
  specular: 0x101010,
  shininess: 4,
  reflectivity: 0,
  flatShading: true,
  vertexColors: THREE.FaceColors
});
*/
export const TERRAIN_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: true,
  emissiveIntensity: 0,
  specular: 0x000000,
  shininess: 0,
  reflectivity: 0,
  flatShading: true,
  color: 0x000000
});
