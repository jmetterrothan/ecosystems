import * as THREE from 'three';

export const CLOUD_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0,
  emissiveIntensity: 0.25,
  specular: 0x252525,
  shininess: 60,
  reflectivity: 0.75,
  flatShading: true,
  color: 0xf4f4f4,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide
});
