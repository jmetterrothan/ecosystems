import * as THREE from 'three';

export const WATER_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0x0068b3,
  emissiveIntensity: 0.25,
  specular: 0x252525,
  shininess: 60,
  reflectivity: 0.75,
  flatShading: true,
  color: 0x0095ff,
  opacity: 0.5,
  transparent: true,
  side: THREE.DoubleSide
});
