import * as THREE from 'three';

import Mesh from './Mesh';
import World from '@world/World';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { CLOUD_MATERIAL } from '@materials/cloud.material';
import { IChunkParameters } from '@shared/models/chunkParameters.model';

class CloudMesh extends Mesh {
  static GEOMETRY: THREE.Geometry = null;

  static lastPosition: THREE.Vector3 = null;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.CLOUD_MESH, <IChunkParameters>{
      nRows: 1,
      nCols: 1,
      cellSizeX: Chunk.WIDTH / 1,
      cellSizeZ: Chunk.WIDTH / 1,
      width: Chunk.WIDTH,
      height: 350,
      depth: Chunk.DEPTH
    });
  }

  buildGeometry(): THREE.Geometry {
    // unique geometry
    if (CloudMesh.GEOMETRY === null) {
      CloudMesh.GEOMETRY = new THREE.BoxGeometry(this.parameters.width, this.parameters.height, this.parameters.depth, 1, 1, 1);
      CloudMesh.lastPosition = new THREE.Vector3(0, 0, 0);
    }

    return CloudMesh.GEOMETRY;
  }

  generate(): THREE.Mesh {
    const mesh = super.generate();
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const x = this.col * this.parameters.width;
    const y = Chunk.CLOUD_LEVEL;
    const z = this.row * this.parameters.depth;

    mesh.geometry.translate(x - CloudMesh.lastPosition.x, y - CloudMesh.lastPosition.y, z - CloudMesh.lastPosition.z);
    CloudMesh.lastPosition.set(x, y, z);

    return mesh;
  }

  getY() {
    return Chunk.CLOUD_LEVEL;
  }

  getMaterial(): THREE.Material {
    return CLOUD_MATERIAL;
  }
}

export default CloudMesh;
