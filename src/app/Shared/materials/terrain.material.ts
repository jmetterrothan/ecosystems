import * as THREE from 'three';

export const TERRAIN_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0x252525,
  emissiveIntensity: 0.125,
  specular: 0x000000,
  shininess: 0,
  reflectivity: 0,
  flatShading: true,
  vertexColors: THREE.FaceColors
});
