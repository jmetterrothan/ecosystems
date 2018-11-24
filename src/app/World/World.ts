import 'seedrandom';

import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';

import Terrain from './Terrain';
import Player from '../Player';

class World
{
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;

  private terrain: Terrain;
  private frustum: THREE.Frustum;
  private seed: number;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: THREE.PointerLockControls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.frustum = new THREE.Frustum();

    // rng
    const rng = new Math.seedrandom();
    this.seed = rng.int32();
    console.info(`SEED : ${this.seed}`);

    this.initObjects();
  }

  private initObjects() {
    /*
    const gizmo = new THREE.AxesHelper();
    gizmo.position.set(0, 0, 0);
    gizmo.scale.set(1, 1, 1);
    this.scene.add(gizmo);
    */

    // fog
    this.scene.fog = new THREE.Fog(0xb1d8ff, Terrain.VIEW_DISTANCE / 2, Terrain.VIEW_DISTANCE - 500);

    // lights
    const light = new THREE.HemisphereLight(0x3a6aa0, 0xffffff, 0.5);
    light.position.set(0, 50, 0);
    this.scene.add(light);

    const sunlight = new THREE.DirectionalLight(0xffffff, 0.35);
    sunlight.position.set(0, 1000, 5);
    this.scene.add(sunlight);

    // stuff
    this.terrain = new Terrain(this.seed);
    this.player = new Player(this.controls);

    this.scene.add(this.controls.getObject());
  }

  public update() {
    this.frustum.setFromMatrix(new THREE.Matrix4().multiplyMatrices(
      this.camera.projectionMatrix,
      this.camera.matrixWorldInverse)
    );

    this.terrain.update(this.scene, this.frustum, this.player);
  }

  public updateMvts(delta) {
    this.player.updateMvts(delta);
  }

  public handleKeyboard(key : string, active : bool) {
    this.player.handleKeyboard(key, active);
  }
}

export default World;
