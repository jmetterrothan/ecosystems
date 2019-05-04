import * as THREE from 'three';

const SHOW_WIREFRAME: boolean = false;

const PARAMETERS_CL = {
  emissive: 0xdddddd,
  emissiveIntensity: 0.05,
  specular: 0x252525,
  shininess: 6,
  reflectivity: 0.2,
  flatShading: true,
  wireframe: false,
  vertexColors: THREE.FaceColors,
};

const PARAMETERS_WIREFRAME = {
  emissive: 0xdddddd,
  emissiveIntensity: 0.05,
  specular: 0x252525,
  shininess: 6,
  reflectivity: 0.2,
  flatShading: true,
  wireframe: true,
  color: new THREE.Color(0, 0, 0)
};

const PARAMETERS = SHOW_WIREFRAME ? PARAMETERS_WIREFRAME : PARAMETERS_CL;

export const TERRAIN_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial(PARAMETERS);

export const TERRAIN_SIDE_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  ...PARAMETERS,
  side: THREE.DoubleSide
});

export const TERRAIN_MATERIAL_WIREFRAME: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
  ...PARAMETERS,
  wireframe: true,
});
