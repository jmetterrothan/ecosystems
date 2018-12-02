import * as THREE from 'three';

export const WATER_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0x000000,
  emissiveIntensity: 0.15,
  specular: 0x000000,
  shininess: 60,
  reflectivity: 0.5,
  flatShading: true,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide,
  vertexColors: THREE.FaceColors,
  blending: THREE.NormalBlending
});
