import PlaneGeometry from '@mesh/PlaneGeometry';
import Mesh from './Mesh';
import World from '@world/World';
import BiomeGenerator from '@world/BiomeGenerator';
import Chunk from '@world/Chunk';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { CLOUD_MATERIAL } from '@materials/cloud.material';
import { IChunkParameters } from '@shared/models/chunkParams.model';

class CloudMesh extends Mesh implements IMesh {
  static readonly GEOMETRY = null;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    super(generator, row, col, MESH_TYPES.CLOUD_MESH, <IChunkParameters>{
      nRows: 1,
      nCols: 1,
      cellSizeX: Chunk.WIDTH / 1,
      cellSizeZ: Chunk.WIDTH / 1,
      width: Chunk.WIDTH,
      height: Chunk.HEIGHT,
      depth: Chunk.DEPTH
    });
  }

  buildGeometry(): THREE.Geometry {
    // unique geometry
    if (CloudMesh.GEOMETRY === null) {
      CloudMesh.GEOMETRY = PlaneGeometry.create(this.parameters.nRows, this.parameters.nCols, this.parameters.cellSizeX, this.parameters.cellSizeZ);
    }

    return CloudMesh.GEOMETRY;
  }

  generate(): THREE.Mesh {
    const mesh = super.generate();

    // TODO : find out why the mesh doesn't move
    mesh.position.x = this.col * this.parameters.width;
    mesh.position.y = this.getY();
    mesh.position.z = this.row * this.parameters.height;

    return mesh;
  }

  getY() {
    return World.CLOUD_LEVEL;
  }

  getMaterial(): THREE.Material {
    return CLOUD_MATERIAL;
  }
}

export default CloudMesh;
