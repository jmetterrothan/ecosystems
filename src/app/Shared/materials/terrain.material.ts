import * as THREE from 'three';

export const TERRAIN_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  wireframe: false,
  emissive: 0x505050,
  emissiveIntensity: 0.05,
  specular: 0x404040,
  shininess: 12,
  reflectivity: 0.15,
  flatShading: true,
  vertexColors: THREE.FaceColors,
  side: THREE.DoubleSide,
});

export const TERRAIN_MATERIAL_WIREFRAME: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  ...TERRAIN_MATERIAL,
  wireframe: true,
});
