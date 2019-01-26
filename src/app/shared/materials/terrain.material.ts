import * as THREE from 'three';

const PARAMETERS = {
  wireframe: false,
  emissive: 0x505050,
  emissiveIntensity: 0.05,
  specular: 0x505050,
  shininess: 3,
  reflectivity: 0.2,
  flatShading: true,
  vertexColors: THREE.FaceColors,
};

export const TERRAIN_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial(PARAMETERS);

export const TERRAIN_SIDE_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  ...PARAMETERS,
  side: THREE.DoubleSide,
});

export const TERRAIN_MATERIAL_WIREFRAME: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  ...PARAMETERS,
  wireframe: true,
});
