import * as THREE from 'three';

import meshphong_disp_vertGlsl from '@shaders/meshphong_disp_vert.glsl';
import meshphong_disp_fragGlsl from '@shaders/meshphong_disp_frag.glsl';

const customUniforms = THREE.UniformsUtils.merge([
  THREE.ShaderLib.phong.uniforms,
  {
    time: { value: 0.0 },
    size: { value: new THREE.Vector3(0, 0, 0) },
    water_distortion: { value: true },
    water_distortion_freq: { value: 4.0 },
    water_distortion_amp: { value: 512.0 },
    shininess: { value: 16 },
    opacity: { value: 0.65 },
    reflectivity: { value: 4.0 },
    emissive: { value: new THREE.Color(0x101010) },
    specular: { value: new THREE.Color(0x505050) },
  }
]);

export const WATER_MATERIAL = new THREE.ShaderMaterial({
  uniforms: customUniforms,
  vertexShader: meshphong_disp_vertGlsl,
  fragmentShader: meshphong_disp_fragGlsl,
  lights: true,
  name: 'custom-material',
  wireframe: false,
  transparent: true,
  flatShading: true,
  depthWrite: false,
  side: THREE.FrontSide,
  vertexColors: THREE.FaceColors,
  fog: true,
});
