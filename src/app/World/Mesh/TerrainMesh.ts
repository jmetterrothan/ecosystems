import Mesh from './Mesh';
import * as THREE from 'three';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import BiomeGenerator from '@world/BiomeGenerator';

class TerrainMesh extends Mesh {

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.TERRAIN_MESH);

    Mesh.material = new THREE.MeshPhongMaterial({
      wireframe: false,
      emissive: 0x505050,
      emissiveIntensity: 0.01,
      specular: 0x353535,
      shininess: 6,
      reflectivity: 0.1,
      flatShading: true,
      vertexColors: THREE.FaceColors
    });
  }

}

export default TerrainMesh;
