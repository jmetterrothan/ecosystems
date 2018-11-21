import simplexNoise from 'simplex-noise';
import * as THREE from 'three';

import Terrain, { TerrainParameters } from './Terrain';

class Chunk
{
  readonly terrain: Terrain;
  readonly row: number;
  readonly col: number;
  mesh: THREE.Mesh;

  constructor(terrain: Terrain, row: number, col: number) {
    this.terrain = terrain;
    this.row = row;
    this.col = col;

    this.mesh = this.generate();
  }

  /**
   * Compute a point of the heightmap
   */
  sumOctaves(x: number, z: number) : number {
    const low = this.terrain.parameters.low;
    const high = this.terrain.parameters.high;
    const it = this.terrain.parameters.iterations;
    const p = this.terrain.parameters.persistence;

    let maxAmp = 0;
    let amp = 1;
    let freq = this.terrain.parameters.scale;
    let noise = 0;

    for (let i = 0; i < it; ++i) {
      noise += this.terrain.simplex.noise2D(x * freq, z * freq) * amp;
      maxAmp += amp;
      amp *= p;
      freq *= 2;
    }

    noise /= maxAmp;

    // keeps the output bewteen the high and low values
    noise *= (high - low) / 2 + (high + low) / 2;

    return noise;
  }

  /**
   * Generate terrain geometry
   */
  buildGeometry(): THREE.Geometry {
    const geometry = new THREE.Geometry();

    // creates all our vertices
    for (let col = 0; col < Chunk.NCOLS; col++) {
      const x = this.col * Chunk.WIDTH + col * Chunk.CELL_SIZE;

      for (let row = 0; row < Chunk.NROWS; row++) {
        const z = this.row * Chunk.DEPTH + row * Chunk.CELL_SIZE;
        const y = this.sumOctaves(x, z);

        geometry.vertices.push(new THREE.Vector3(x, y, z));
      }
    }

    // creates the associated faces with their indexes
    for (let col = 0; col < Chunk.NCOLS - 1; col++) {
      for (let row = 0; row < Chunk.NROWS - 1; row++) {
        const a = col + Chunk.NCOLS * row;
        const b = (col + 1) + Chunk.NCOLS * row;
        const c = col + Chunk.NCOLS * (row + 1);
        const d = (col + 1) + Chunk.NCOLS * (row + 1);

        geometry.faces.push(new THREE.Face3(a, b, d));
        geometry.faces.push(new THREE.Face3(d, c, a));
      }
    }

    // need to tell the engine we updated the vertices
    geometry.verticesNeedUpdate = true;

    // need to update normals for smooth shading
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    geometry.normalsNeedUpdate	= true;

    return geometry;
  }

  /**
   * Generate terrain mesh
   */
  generate(): THREE.Mesh {
    const material = new THREE.MeshLambertMaterial({
      wireframe: false,
      color: 0x757575,
      // specular: 0xffffff,
      flatShading: true,
    });

    const geometry = this.buildGeometry();

    const mesh = new THREE.Mesh(geometry, material);
    mesh.frustumCulled = false;

    return mesh;
  }
}

Chunk.NROWS = 16;
Chunk.NCOLS = 16;
Chunk.CELL_SIZE = 1;
Chunk.WIDTH = (Chunk.NCOLS - Chunk.CELL_SIZE) * Chunk.CELL_SIZE;
Chunk.DEPTH = (Chunk.NROWS - Chunk.CELL_SIZE) * Chunk.CELL_SIZE;

export default Chunk;
