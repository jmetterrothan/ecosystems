import * as THREE from 'three';
import Mesh from './Mesh';

import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';
import World from '@world/World';
import PlaneGeometry from '@mesh/PlaneGeometry';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { WATER_MATERIAL } from '@materials/water.material';
import { IChunkParameters } from '@shared/models/chunkParameters.model';

class WaterMesh extends Mesh {
  static GEOMETRY = null;
  static lastPosition: THREE.Vector3 = null;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.WATER_MESH, <IChunkParameters>{
      nRows: 4,
      nCols: 4,
      cellSizeX: Chunk.WIDTH / 4,
      cellSizeZ: Chunk.WIDTH / 4,
      width: Chunk.WIDTH,
      height: Chunk.HEIGHT,
      depth: Chunk.DEPTH
    });
  }

  getY() {
    return World.SEA_LEVEL;
  }

  getMaterial(): THREE.Material {
    return WATER_MATERIAL;
  }

  buildGeometry(): THREE.Geometry {
    if (WaterMesh.GEOMETRY === null) {
      WaterMesh.GEOMETRY = PlaneGeometry.create(this.parameters.nRows, this.parameters.nCols, this.parameters.cellSizeX, this.parameters.cellSizeZ, this.generator);
      WaterMesh.lastPosition = new THREE.Vector3(0, 0, 0);
    }

    return WaterMesh.GEOMETRY;
  }

  generate(): THREE.Mesh {
    const mesh = super.generate();

    const x = this.col * this.parameters.width;
    const y = World.SEA_LEVEL;
    const z = this.row * this.parameters.depth;

    mesh.geometry.translate(x - WaterMesh.lastPosition.x, y - WaterMesh.lastPosition.y, z - WaterMesh.lastPosition.z);
    WaterMesh.lastPosition.set(x, y, z);

    return mesh;
  }
}

export default WaterMesh;
