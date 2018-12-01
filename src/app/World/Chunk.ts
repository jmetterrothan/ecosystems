import * as THREE from 'three';
import poissonDiskSampling from 'poisson-disk-sampling';

import Utils from '@shared/Utils';
import World from './World';
import Terrain from './Terrain';

class Chunk {
  static readonly MAX_CHUNK_HEIGHT: number = 20000;
  static readonly MIN_CHUNK_HEIGHT: number = -10000;
  static readonly NROWS: number = 16;
  static readonly NCOLS: number = 16;
  static readonly CELL_SIZE: number = 80;

  static readonly WIDTH: number = Chunk.NCOLS * Chunk.CELL_SIZE;
  static readonly DEPTH: number = Chunk.NROWS * Chunk.CELL_SIZE;

  static readonly DEFAULT_MATERIAL: THREE.MeshPhongMaterial = new THREE.MeshPhongMaterial({
    wireframe: false,
    emissive: 0xffffff,
    emissiveIntensity: 0.075,
    specular: 0x252525,
    shininess: 12,
    reflectivity: 0.75,
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
    const padding = 175; // object bounding box size / 2
    const pds = new poissonDiskSampling([Chunk.WIDTH - padding, Chunk.DEPTH - padding], padding * 2, padding * 2, 30, Utils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = padding + this.col * Chunk.WIDTH + point.shift();
      const z = padding + this.row * Chunk.DEPTH + point.shift();

      // compute object height
      const y = this.generator.computeElevation(x, z);

      // select an organism based on the current biome
      const object = this.generator.pick(y);

      if (object) {
        object.position.set(x, y, z);
        scene.add(object);
      }
    });
  }

  /**
   * Generate terrain geometry
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
        const y = this.generator.computeElevation(x, z);

        if (this.low > y) this.low = y;
        if (this.high < y) this.high = y;

        geometry.vertices.push(new THREE.Vector3(x, Chunk.normalizedY(y), z));
        // geometry.vertices.push(new THREE.Vector3(x, yNormalized, z));
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

        const m1 = 0; // this.generator.computeMoisture(x1, z1);
        const m2 = 0; // this.generator.computeMoisture(x2, z2);

        f1.color = this.generator.paint(y1 / Chunk.MAX_HEIGHT, m1);
        f2.color = this.generator.paint(y2 / Chunk.MAX_HEIGHT, m2);

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

  static normalizedY(y: number) {
    return y * ((Chunk.MAX_CHUNK_HEIGHT - Chunk.MIN_CHUNK_HEIGHT) + Chunk.MIN_CHUNK_HEIGHT);
  }
}

export default Chunk;
