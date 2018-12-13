import * as THREE from 'three';
import Mesh from './Mesh';

import BiomeGenerator from '@world/BiomeGenerator';
import Terrain from '@world/Terrain';
import Chunk from '@world/Chunk';

import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { WATER_MATERIAL } from '@materials/water.material';
import { IChunkParameters } from '@shared/models/chunkParameters.model';

class WaterMesh extends Mesh {
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

  buildGeometry(): THREE.Geometry {
    const geometry: THREE.Geometry = new THREE.Geometry();

    const nbVerticesX = this.parameters.nCols + 1;
    const nbVerticesZ = this.parameters.nRows + 1;

    // creates all our vertices
    for (let c = 0; c < nbVerticesX; c++) {
      const x = this.col * this.parameters.width + c * this.parameters.cellSizeX;
      for (let r = 0; r < nbVerticesZ; r++) {
        const z = this.row * this.parameters.depth + r * this.parameters.cellSizeZ;
        let y = this.getY(x, z);

        if ((this.col === 0 && c === 0) || (this.row === 0 && r === 0) || (this.col === Terrain.NCHUNKS_X - 1 && c === nbVerticesX - 1) || (this.row === Terrain.NCHUNKS_Z - 1 && r === nbVerticesZ - 1)) {
          y = Chunk.SEA_LEVEL;
        }

        if (this.low === null || this.low > y) this.low = y;
        if (this.high === null || this.high < y) this.high = y;

        geometry.vertices.push(new THREE.Vector3(x, y, z));
      }
    }

    // creates the associated faces with their indexes
    let sumMoisture = 0;

    for (let col = 0; col < this.parameters.nCols; col++) {
      for (let row = 0; row < this.parameters.nRows; row++) {
        const a = col + nbVerticesX * row;
        const b = (col + 1) + nbVerticesX * row;
        const c = col + nbVerticesX * (row + 1);
        const d = (col + 1) + nbVerticesX * (row + 1);

        const f1 = new THREE.Face3(a, b, d);
        const f2 = new THREE.Face3(d, c, a);

        const x1 = (geometry.vertices[a].x + geometry.vertices[b].x + geometry.vertices[d].x) / 3;
        const x2 = (geometry.vertices[d].x + geometry.vertices[c].x + geometry.vertices[a].x) / 3;

        const z1 = (geometry.vertices[a].z + geometry.vertices[b].z + geometry.vertices[d].z) / 3;
        const z2 = (geometry.vertices[d].z + geometry.vertices[c].z + geometry.vertices[a].z) / 3;

        const m1 = this.generator.computeMoistureAt(x1, z1);
        const m2 = this.generator.computeMoistureAt(x2, z2);

        f1.color = this.generator.getWaterColor(m1);
        f2.color = this.generator.getWaterColor(m2);

        geometry.faces.push(f1);
        geometry.faces.push(f2);

        sumMoisture += m1 + m2;
      }
    }

    this.moistureAverage = sumMoisture / (this.parameters.nCols * this.parameters.nRows * 2);

    // need to tell the engine we updated the vertices
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;

    // need to update normals for smooth shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;

    return geometry;
  }

  getY(x, z) {
    return this.generator.computeWaterHeightAt(x, z);
  }

  getMaterial(): THREE.Material {
    return WATER_MATERIAL;
  }
}

export default WaterMesh;
