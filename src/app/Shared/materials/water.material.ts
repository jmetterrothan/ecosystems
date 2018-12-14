import * as THREE from 'three';

export const WATER_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0xffffff,
  emissiveIntensity: 0.1,
  specular: 0x505050,
  shininess: 25,
  reflectivity: 0.5,
  flatShading: true,
  opacity: 0.75,
  transparent: true,
  side: THREE.DoubleSide,
  vertexColors: THREE.FaceColors,
});

export const WATER_SIDE_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0x202020,
  emissiveIntensity: 0.1,
  specular: 0x000000,
  shininess: 25,
  reflectivity: 0.5,
  flatShading: true,
  opacity: 0.6,
  transparent: true,
  side: THREE.DoubleSide,
  vertexColors: THREE.FaceColors,
});
