import * as THREE from 'three';

export const TERRAIN_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0x505050,
  emissiveIntensity: 0.05,
  specular: 0x252525,
  shininess: 8,
  reflectivity: 0.05,
  flatShading: true,
  vertexColors: THREE.FaceColors
});
