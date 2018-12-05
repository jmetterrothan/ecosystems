import * as THREE from 'three';
import BiomeGenerator from '@world/BiomeGenerator';

class PlaneGeometry {
  static create(nrows: number, ncols: number, cellsizeX: number, cellsizeZ: number, generator: BiomeGenerator): THREE.Geometry {
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

        const f1 = new THREE.Face3(a, b, d);
        const f2 = new THREE.Face3(d, c, a);

        const x1 = (geometry.vertices[a].x + geometry.vertices[b].x + geometry.vertices[d].x) / 3;
        const x2 = (geometry.vertices[d].x + geometry.vertices[c].x + geometry.vertices[a].x) / 3;

        const z1 = (geometry.vertices[a].z + geometry.vertices[b].z + geometry.vertices[d].z) / 3;
        const z2 = (geometry.vertices[d].z + geometry.vertices[c].z + geometry.vertices[a].z) / 3;

        const m1 = generator.computeMoisture(x1, z1);
        const m2 = generator.computeMoisture(x2, z2);

        f1.color = generator.getWaterColor(m1);
        f2.color = generator.getWaterColor(m2);

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
}

export default PlaneGeometry;
