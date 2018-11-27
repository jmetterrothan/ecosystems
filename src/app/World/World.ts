import * as THREE from 'three';
import 'three/examples/js/controls/PointerLockControls';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';
import 'seedrandom';

import Terrain from './Terrain';
import Player from '../Player';
import Chunk from './Chunk';
import spruceObj from '../../obj/spruce/spruce.obj';
import spruceMtl from '../../obj/spruce/spruce.mtl';

import red_mushroomObj from '../../obj/red_mushroom/red_mushroom.obj';
import red_mushroomMtl from '../../obj/red_mushroom/red_mushroom.mtl';

import brown_mushroomObj from '../../obj/brown_mushroom/brown_mushroom.obj';
import brown_mushroomMtl from '../../obj/brown_mushroom/brown_mushroom.mtl';

class World {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private controls: THREE.PointerLockControls;

  private player: Player;

  private terrain: Terrain;
  private frustum: THREE.Frustum;
  private seed: string;

  constructor(scene: THREE.Scene, camera: THREE.PerspectiveCamera, controls: THREE.PointerLockControls) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;

    this.frustum = new THREE.Frustum();

    // seed
    this.seed = Utils.randomUint32().toString();
    Math.seedrandom(this.seed);
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
    this.terrain = new Terrain(this.seed.toString());
    this.player = new Player(this.controls);

    this.scene.add(this.controls.getObject());

    // load test
    World.loadModel('spruce', spruceObj, spruceMtl).then((object) => {
      const x = 0;
      const z = -700;
      const y = this.terrain.getHeightAt(x, z);

      object.position.set(x, y, z);
      object.scale.set(150, 150, 150);

      this.scene.add(object);
    });

    World.loadModel('red_mushroom', red_mushroomObj, red_mushroomMtl).then((object) => {
      const x = 0;
      const z = -500;
      const y = this.terrain.getHeightAt(x, z);

      object.position.set(x, y, z);
      object.scale.set(50, 50, 50);

      this.scene.add(object);
    });

    World.loadModel(brown_mushroomObj, brown_mushroomMtl).then((object) => {
      const x = 200;
      const z = 200;
      const y = this.terrain.getHeightAt(x, z);

      object.position.set(x, y, z);
      object.scale.set(50, 50, 50);

      this.scene.add(object);
    });
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
    this.player.updatePosition(this.terrain);
  }

  public handleKeyboard(key: string, active: boolean) {
    this.player.handleKeyboard(key, active);
  }

  static loadModel(name: string, objSrc: string, mtlSrc: string) {
    return new Promise<THREE.Object3D>((resolve, reject) => {
      const objLoader = new THREE.OBJLoader();
      const mtlLoader = new THREE.MTLLoader();

      mtlLoader.load(mtlSrc, (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);

        objLoader.load(objSrc, (object) => {
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;

              child.material = new THREE.MeshPhongMaterial({
                wireframe: false,
                emissive: 0xffffff,
                emissiveIntensity: 0.05,
                specular: 0xffffff,
                shininess: 8,
                flatShading: true,
                color: child.material.color
              });
            }
          });

          resolve(object);
        },             null, () => reject());
      },             null, () => reject());
    });
  }
}

export default World;
