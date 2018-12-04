import * as THREE from 'three';

import BiomeGenerator from '@world/BiomeGenerator';
import Stack from '@shared/Stack';
import World from '../World/World';

import { MESH_TYPES } from '@shared/enums/mesh.enum';

import { CLOUD_MATERIAL } from '@materials/cloud.material';
import { WATER_MATERIAL } from '@materials/water.material';
import { TERRAIN_MATERIAL } from '@materials/terrain.material';

import { IChunkParameters } from '@shared/models/chunkParams.model';

class Mesh {
  static GEOMETRY_STACK = new Stack<THREE.Geometry>();

  readonly row: number;
  readonly col: number;

  protected low: number;
  protected high: number;

  protected moistureAverage: number;

  private readonly type: MESH_TYPES;
  private readonly parameters: IChunkParams;
  private generator: BiomeGenerator;

  constructor(generator: BiomeGenerator, row: number, col: number, type: MESH_TYPES, parameters: IChunkParameters) {
    this.generator = generator;
    this.row = row;
    this.col = col;
    this.type = type;
    this.parameters = parameters;

    this.low = null;
    this.high = null;
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
        const y = this.getY(this.type, x, z);

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

        const y1 = (geometry.vertices[a].y + geometry.vertices[b].y + geometry.vertices[d].y) / 3;
        const y2 = (geometry.vertices[d].y + geometry.vertices[c].y + geometry.vertices[a].y) / 3;

        const z1 = (geometry.vertices[a].z + geometry.vertices[b].z + geometry.vertices[d].z) / 3;
        const z2 = (geometry.vertices[d].z + geometry.vertices[c].z + geometry.vertices[a].z) / 3;

        const m1 = this.generator.computeMoisture(x1, z1);
        const m2 = this.generator.computeMoisture(x2, z2);

        if (this.type === MESH_TYPES.TERRAIN_MESH) {
          f1.color = this.generator.getBiome(BiomeGenerator.getElevationFromHeight(y1), m1).color;
          f2.color = this.generator.getBiome(BiomeGenerator.getElevationFromHeight(y2), m2).color;
        } else if (this.type === MESH_TYPES.WATER_MESH) {
          f1.color = this.generator.getWaterColor(m1);
          f2.color = this.generator.getWaterColor(m2);
        }

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

  generate(): THREE.Mesh {
    const geometry = this.getGeometry();
    const material = this.getMaterial(this.type);

    const mesh = new THREE.Mesh(geometry, material);

    mesh.frustumCulled = false;
    mesh.visible = false;
    mesh.matrixAutoUpdate = false;
    mesh.receiveShadow = true;

    return mesh;
  }

  private getGeometry() {
    return this.buildGeometry();
  }

  private getMaterial(type: MESH_TYPES): THREE.Material {
    switch (type) {
      case MESH_TYPES.WATER_MESH:
        return WATER_MATERIAL;

      case MESH_TYPES.CLOUD_MESH:
        return CLOUD_MATERIAL;

      default:
        return TERRAIN_MATERIAL;
    }
  }

  private getY(type: MESH_TYPES, x?: number, z?: number): number {
    switch (type) {
      case MESH_TYPES.TERRAIN_MESH:
        return this.generator.computeHeight(x, z);

      case MESH_TYPES.WATER_MESH:
        return World.SEA_LEVEL;

      case MESH_TYPES.CLOUD_MESH:
        return World.CLOUD_LEVEL;
    }
  }

}

export default Mesh;
