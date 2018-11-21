import * as THREE from 'three';

class Chunk
{
  constructor(row, col, simplex, parameters) {
    this.row = row;
    this.col = col;
    this.mesh = this.generate(simplex, parameters);
  }

  /**
   * Compute a point of the heightmap
   * @param {number} x
   * @param {number} z
   * @param {SimplexNoise} simplex
   * @param {number} it
   * @param {number} persistence
   * @param {number} scale
   * @param {number} low
   * @param {number} high
   * @return {number} y component
   */
  static sumOctaves(x, z, simplex, it, persistence, scale, low, high) {
    let maxAmp = 0;
    let amp = 1;
    let freq = scale;
    let noise = 0;

    for (let i = 0; i < it; ++i) {
      noise += simplex.noise2D(x * freq, z * freq) * amp;
      maxAmp += amp;
      amp *= persistence;
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
  buildGeometry(simplex, parameters) {
    const geometry = new THREE.Geometry();

    // creates all our vertices
    for (let col = 0; col < Chunk.NCOLS; col++) {
      const x = this.col * Chunk.WIDTH + col * Chunk.CELL_SIZE;

      for (let row = 0; row < Chunk.NROWS; row++) {
        const z = this.row * Chunk.DEPTH + row * Chunk.CELL_SIZE;
        const y = Chunk.sumOctaves(
          x,
          z,
          simplex,
          parameters.iterations,
          parameters.persistence,
          parameters.scale,
          parameters.low,
          parameters.high
        );

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

  generate(simplex, parameters) {
    const material = new THREE.MeshLambertMaterial({
      color: 0xbfbfbf,
      wireframe: false,
      flatShading: true,
    });

    const geometry = this.buildGeometry(simplex, parameters);

    return new THREE.Mesh(geometry, material);
  }
}

Chunk.NROWS = 16;
Chunk.NCOLS = 16;
Chunk.CELL_SIZE = 1;
Chunk.WIDTH = (Chunk.NCOLS - Chunk.CELL_SIZE) * Chunk.CELL_SIZE;
Chunk.DEPTH = (Chunk.NROWS - Chunk.CELL_SIZE) * Chunk.CELL_SIZE;

export default Chunk;
