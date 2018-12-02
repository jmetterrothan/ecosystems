
import * as THREE from 'three';

import BiomeGenerator from '@world/BiomeGenerator';
import Stack from '@shared/Stack';

import { CHUNK_PARAMS } from '@shared/constants/chunkParams.constants';
import { MESH_TYPES } from '@shared/enums/mesh.enum';
import { WATER_CONSTANTS } from '@shared/constants/water.constants';
import { WATER_MATERIAL } from './constants/waterMaterial.constants';
import { TERRAIN_MATERIAL } from './constants/terrainMesh.constants';

class Mesh {
  static GEOMETRY_STACK = new Stack<THREE.Geometry>();

  mesh: THREE.Mesh;

  readonly row: number;
  readonly col: number;

  protected low: number;
  protected high: number;
  private readonly type: MESH_TYPES;
  private generator: BiomeGenerator;

  constructor(generator: BiomeGenerator, row: number, col: number, type: MESH_TYPES) {
    this.generator = generator;
    this.row = row;
    this.col = col;
    this.type = type;

    this.low = this.generator.computeHeight(this.col * CHUNK_PARAMS.WIDTH, this.row * CHUNK_PARAMS.DEPTH);
    this.high = 0;
  }

  buildGeometry(): THREE.Geometry {
    const geometry: THREE.Geometry = new THREE.Geometry();

    const nbVerticesX = CHUNK_PARAMS.NCOLS + 1;
    const nbVerticesZ = CHUNK_PARAMS.NROWS + 1;

    // creates all our vertices
    for (let c = 0; c < nbVerticesX; c++) {
      const x = this.col * CHUNK_PARAMS.WIDTH + c * CHUNK_PARAMS.CELL_SIZE;
      for (let r = 0; r < nbVerticesZ; r++) {
        const z = this.row * CHUNK_PARAMS.DEPTH + r * CHUNK_PARAMS.CELL_SIZE;
        const y = this.type === MESH_TYPES.TERRAIN_MESH ? this.generator.computeHeight(x, z) : WATER_CONSTANTS.SEA_LEVEL;

        if (this.low > y) this.low = y;
        if (this.high < y) this.high = y;

        geometry.vertices.push(new THREE.Vector3(x, y, z));
        // geometry.colors.push(this.getColor(grad, y));
      }
    }

    // creates the associated faces with their indexes

    for (let col = 0; col < CHUNK_PARAMS.NCOLS; col++) {
      for (let row = 0; row < CHUNK_PARAMS.NROWS; row++) {
        const a = col + nbVerticesX * row;
        const b = (col + 1) + nbVerticesX * row;
        const c = col + nbVerticesX * (row + 1);
        const d = (col + 1) + nbVerticesX * (row + 1);

        const f1 = new THREE.Face3(a, b, d);
        const f2 = new THREE.Face3(d, c, a);

        // METHOD 1 : each face gets a color based on the average height of their vertices
        const x1 = (geometry.vertices[a].x + geometry.vertices[b].x + geometry.vertices[d].x) / 3;
        const x2 = (geometry.vertices[d].x + geometry.vertices[c].x + geometry.vertices[a].x) / 3;

        const y1 = (geometry.vertices[a].y + geometry.vertices[b].y + geometry.vertices[d].y) / 3;
        const y2 = (geometry.vertices[d].y + geometry.vertices[c].y + geometry.vertices[a].y) / 3;

        const z1 = (geometry.vertices[a].z + geometry.vertices[b].z + geometry.vertices[d].z) / 3;
        const z2 = (geometry.vertices[d].z + geometry.vertices[c].z + geometry.vertices[a].z) / 3;

        if (this.type === MESH_TYPES.TERRAIN_MESH) {
          const m1 = this.generator.computeMoisture(x1, z1);
          const m2 = this.generator.computeMoisture(x2, z2);

          f1.color = this.generator.getBiome(BiomeGenerator.getElevationFromHeight(y1), m1).color;
          f2.color = this.generator.getBiome(BiomeGenerator.getElevationFromHeight(y2), m2).color;
        }

        /*
        // METHOD 2 : each vertices gets a different color based on height and colors are interpolated
        f1.vertexColors[0] = geometry.colors[a];
        f1.vertexColors[1] = geometry.colors[b];
        f1.vertexColors[2] = geometry.colors[d];
        f2.vertexColors[0] = geometry.colors[d];
        f2.vertexColors[1] = geometry.colors[c];
        f2.vertexColors[2] = geometry.colors[a];
        */

        geometry.faces.push(f1);
        geometry.faces.push(f2);
      }
    }

    // need to tell the engine we updated the vertices
    geometry.verticesNeedUpdate = true;
    geometry.colorsNeedUpdate = true;

    // need to update normals for smooth shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate = true;

    return geometry;
  }

  rebuildGeometry(geometry: THREE.Geometry) {
    return geometry;
  }

  generate(): THREE.Mesh {
    const geometry = this.getGeometry();
    const mesh = new THREE.Mesh(geometry, this.type === MESH_TYPES.TERRAIN_MESH ? TERRAIN_MATERIAL : WATER_MATERIAL);

    mesh.frustumCulled = false;
    mesh.visible = false;
    mesh.matrixAutoUpdate = false;
    mesh.receiveShadow = true;

    return mesh;
  }

  private getGeometry() {
    return this.buildGeometry();
    // return Mesh.GEOMETRY_STACK.empty ? this.buildGeometry() : this.rebuildGeometry(Mesh.GEOMETRY_STACK.pop());
  }
}

export default Mesh;
