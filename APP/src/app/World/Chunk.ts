import * as THREE from 'three';
import { IColor } from './../Shared/models/color.model';
import simplexNoise from 'simplex-noise';
import poissonDiskSampling from 'poisson-disk-sampling';

import Utils from '@shared/Utils';
import World from './World';
import Terrain from './Terrain';
import Biome from './Biome';

class Chunk {
  static readonly MAX_CHUNK_HEIGHT: number = 2000;
  static readonly MIN_CHUNK_HEIGHT: number = -300;
  static readonly NROWS: number = 16;
  static readonly NCOLS: number = 16;
  static readonly CELL_SIZE: number = 64;

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

  readonly row: number;
  readonly col: number;

  readonly simplex: simplexNoise;

  readonly biome: Biome;

  mesh: THREE.Mesh;

  constructor(simplex: simplexNoise, row: number, col: number) {
    this.simplex = simplex;
    this.row = row;
    this.col = col;
    this.biome = Biome.LIST.get('hills'); // TODO: put biome as parameter

    this.mesh = this.generate();
  }

  /**
   * Compute a point of the heightmap
   * TODO: put generation in Biome
   */
  static sumOctaves(simplex: simplexNoise, x: number, z: number): number {
    const nx = x / Chunk.CELL_SIZE - 0.5;
    const nz = z / Chunk.CELL_SIZE - 0.5;

    let e = 0;
    let amp = 1;
    let f = 0.00375;

    for (let i = 0; i < 8; i++) {
      e += amp * simplex.noise3D(f * nx, 1, f * nz);
      amp /= 1.85;
      f *= 1.95;
    }

    const noise = e * ((Chunk.MAX_CHUNK_HEIGHT + Chunk.MIN_CHUNK_HEIGHT) / 2 + (Chunk.MAX_CHUNK_HEIGHT - Chunk.MAX_CHUNK_HEIGHT) / 2);

    if (noise > 0) {
      return Math.pow(noise, 1.115);
    }
    return noise / 2.5;
  }

  populate(scene: THREE.Scene, terrain: Terrain) {
    const padding = 175; // object bounding box size / 2
    const pds = new poissonDiskSampling([Chunk.WIDTH - padding, Chunk.DEPTH - padding], padding * 2, padding * 2, 30, Utils.rng);
    const points = pds.fill();

    points.forEach((point: number[]) => {
      const x = padding + this.col * Chunk.WIDTH + point.shift();
      const z = padding + this.row * Chunk.DEPTH + point.shift();

      // compute object height
      const y = terrain.getHeightAt(x, z);

      // select an organism based on the current biome
      const object = this.biome.pick(y);

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
        const y = Chunk.sumOctaves(this.simplex, x, z);

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
        const y1 = (geometry.vertices[a].y + geometry.vertices[b].y + geometry.vertices[d].y) / 3;
        const y2 = (geometry.vertices[d].y + geometry.vertices[c].y + geometry.vertices[a].y) / 3;
        f1.color = this.biome.getColor(y1);
        f2.color = this.biome.getColor(y2);

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

    return mesh;
  }
}

export default Chunk;
