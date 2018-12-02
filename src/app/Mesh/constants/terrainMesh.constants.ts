import * as THREE from 'three';

export const TERRAIN_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0x505050,
  emissiveIntensity: 0.01,
  specular: 0x353535,
  shininess: 6,
  reflectivity: 0.1,
  flatShading: true,
  vertexColors: THREE.FaceColors
});
