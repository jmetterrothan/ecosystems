import * as THREE from 'three';

class PlaneGeometry {
  /**
   * Creates a new plane geometry
   * @param {number} nrows
   * @param {number} ncols
   * @param {number} cellsizeX
   * @param {number} cellsizeZ
   * @return {THREE.Geometry}
   */
  static create(nrows: number, ncols: number, cellsizeX: number, cellsizeZ: number): THREE.Geometry {
    const geometry: THREE.Geometry = new THREE.Geometry();

    const nbVerticesX = ncols + 1;
    const nbVerticesZ = nrows + 1;

    // creates all our vertices
    for (let col = 0; col < nbVerticesX; col++) {
      for (let row = 0; row < nbVerticesZ; row++) {
        geometry.vertices.push(new THREE.Vector3(col * cellsizeX, 0, row * cellsizeZ));
      }
    }

    for (let col = 0; col < ncols; col++) {
      for (let row = 0; row < nrows; row++) {
        const a = col + nbVerticesX * row;
        const b = (col + 1) + nbVerticesX * row;
        const c = col + nbVerticesX * (row + 1);
        const d = (col + 1) + nbVerticesX * (row + 1);

        geometry.faces.push(new THREE.Face3(a, b, d));
        geometry.faces.push(new THREE.Face3(d, c, a));
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
}

export default PlaneGeometry;
