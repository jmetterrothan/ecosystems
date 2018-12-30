import * as THREE from 'three';

import meshphong_disp_vertGlsl from '@shaders/meshphong_disp_vert.glsl';

const customUniforms = THREE.UniformsUtils.merge([
  THREE.ShaderLib.phong.uniforms,
  {
    time: { value: 0.0 },
    water_distortion: { value: true },
    water_distortion_freq: { value: 2.0 },
    water_distortion_amp: { value: 1000.0 },
    shininess: { value: 35 },
    opacity: { value: 0.65 },
    reflectivity: { value: 0.75 },
    specular: { value: new THREE.Color(0x505050) }
  }
]);

export const WATER_MATERIAL = new THREE.ShaderMaterial({
  uniforms: customUniforms,
  vertexShader: meshphong_disp_vertGlsl,
  fragmentShader: THREE.ShaderLib.phong.fragmentShader,
  lights: true,
  name: 'custom-material',
  wireframe: false,
  transparent: true,
  flatShading: true,
  side: THREE.DoubleSide,
  vertexColors: THREE.FaceColors,
});

/*
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
*/
