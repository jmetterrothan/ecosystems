export interface ICloudData {
  particles: THREE.Geometry;
  particleMaterial: THREE.PointsMaterial;
  particleSystem: THREE.Points;
  isRaininig: boolean;
  allParticlesDropped: boolean;
}