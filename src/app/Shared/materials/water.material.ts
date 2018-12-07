import * as THREE from 'three';

export const WATER_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0xffffff,
  emissiveIntensity: 0.15,
  specular: 0x252525,
  shininess: 25,
  reflectivity: 0.5,
  flatShading: true,
  opacity: 0.75,
  transparent: true,
  side: THREE.DoubleSide,
  vertexColors: THREE.FaceColors,
});
