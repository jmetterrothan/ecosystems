import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';

import Utils from '@shared/Utils';
import World from './World';
import Terrain from './Terrain';
import BiomeGenerator from './BiomeGenerator';

class Chunk {
  static readonly MAX_CHUNK_HEIGHT: number = 20000;
  static readonly MIN_CHUNK_HEIGHT: number = -10000;
  static readonly NROWS: number = 8;
  static readonly NCOLS: number = 8;
  static readonly CELL_SIZE: number = 160;

  static readonly WIDTH: number = Chunk.NCOLS * Chunk.CELL_SIZE;
  static readonly DEPTH: number = Chunk.NROWS * Chunk.CELL_SIZE;

  static readonly DEFAULT_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
    wireframe: false,
    emissive: 0x505050,
    emissiveIntensity: 0.01,
    specular: 0x353535,
    shininess: 6,
    reflectivity: 0.1,
    flatShading: true,
    vertexColors: THREE.FaceColors
  });

  private high: number; // highest point of the chunk
  private low: number; // lowest point of the chunk
  readonly row: number;
  readonly col: number;

  mesh: THREE.Mesh;
  generator: BiomeGenerator;

  constructor(generator: BiomeGenerator, row: number, col: number) {
    this.generator = generator;
    this.row = row;
    this.col = col;
    this.low = 0;
    this.high = 0;

    this.mesh = this.generate();
  }

  populate(scene: THREE.Scene) {
    const padding = 300; // object bounding box size / 2
    const pds = new poissonDiskSampling([Chunk.WIDTH - padding, Chunk.DEPTH - padding], padding * 2, padding * 2, 30, Utils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = padding + this.col * Chunk.WIDTH + point.shift();
      const z = padding + this.row * Chunk.DEPTH + point.shift();
      const y = this.generator.computeHeight(x, z);

      // select an organism based on the current biome
      const object = this.generator.pick(x, z);

      if (object) {
        object.position.set(x, y, z);
        scene.add(object);
      }
    });
  }

  /**
   * Generate terrain geometry
   * @return {THREE.Geometry}
   */
  buildGeometry(): THREE.Geometry {
    const geometry = new THREE.Geometry();

    const nbVerticesX = Chunk.NCOLS + 1;
    const nbVerticesZ = Chunk.NROWS + 1;

    // creates all our vertices
    for (let c = 0; c < nbVerticesX; c++) {
      const x = this.col * Chunk.WIDTH + c * Chunk.CELL_SIZE;
      for (let r = 0; r < nbVerticesZ; r++) {
        const z = this.row * Chunk.DEPTH + r * Chunk.CELL_SIZE;
        const y = this.generator.computeHeight(x, z);

        if (this.low > y) this.low = y;
        if (this.high < y) this.high = y;

        geometry.vertices.push(new THREE.Vector3(x, y, z));
        // geometry.colors.push(this.getColor(grad, y));
      }
    }

    // creates the associated faces with their indexes

    for (let col = 0; col < Chunk.NCOLS; col++) {
      for (let row = 0; row < Chunk.NROWS; row++) {
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

        const m1 = this.generator.computeMoisture(x1, z1);
        const m2 = this.generator.computeMoisture(x2, z2);

        f1.color = this.generator.getBiome(BiomeGenerator.getElevationFromHeight(y1), m1).color;
        f2.color = this.generator.getBiome(BiomeGenerator.getElevationFromHeight(y2), m2).color;

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

  /**
   * Generate terrain mesh
   * @return {THREE.Mesh}
   */
  generate(): THREE.Mesh {
    const geometry = this.buildGeometry();
    const mesh = new THREE.Mesh(geometry, Chunk.DEFAULT_MATERIAL);

    mesh.frustumCulled = false;
    mesh.visible = false;
    mesh.matrixAutoUpdate = false;
    mesh.receiveShadow = true;

    return mesh;
  }
}

export default Chunk;
