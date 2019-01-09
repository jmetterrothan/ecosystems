import MultiplayerService, { multiplayerSvc } from './multiplayer.service';
import * as THREE from 'three';

import World from '@world/World';

import TranslationService, { translationSvc } from '@services/translation.service';
import ProgressionService, { progressionSvc } from '@services/progression.service';

import { IObject } from '@shared/models/object.model';
import { ITexture } from '@shared/models/texture.model';

import { OBJECTS } from '@shared/constants/object.constants';
import { TEXTURES } from '@shared/constants/texture.constants';

class CoreService {

  private translationSvc: TranslationService;
  private progressionSvc: ProgressionService;
  private multiplayerSvc: MultiplayerService;

  constructor() {
    this.translationSvc = translationSvc;
    this.progressionSvc = progressionSvc;
    this.multiplayerSvc = multiplayerSvc;
  }

  async init() {
    this.progressionSvc.init();
    await this.multiplayerSvc.init();
    await this.translationSvc.init();
    await this.initModels();
    await this.initTextures();
  }

  private async initModels(): Promise<any> {
    const stack = OBJECTS.map((element: IObject) => {
      const p = this.loadObjModel(element);

      return p.then((object) => {
        object.scale.set(World.OBJ_INITIAL_SCALE, World.OBJ_INITIAL_SCALE, World.OBJ_INITIAL_SCALE); // scale from maya size to a decent world size
      });
    });

    await Promise.all(stack);
  }

  /**
   * Load an obj file
   * @param name Name of the object
   * @param objSrc obj source file path
   * @param mtlSrc mtl source file path
   * @return Promise<any>
   */
  private loadObjModel(element: IObject) {
    return new Promise<any>((resolve, reject) => {
      if (World.LOADED_MODELS.has(element.name)) {
        resolve(World.LOADED_MODELS.get(element.name));
      }

      const objLoader = new THREE.OBJLoader();
      const mtlLoader = new THREE.MTLLoader();

      mtlLoader.load(element.mtl, (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);

        objLoader.load(element.obj, (object) => {

          object.castShadow = true;
          object.receiveShadow = false;
          object.frustumCulled = false;

          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = false;
              child.frustumCulled = false;

              if (!(child.material instanceof THREE.Material)) {
                child.material.forEach(material => {
                  material.flatShading = true;
                  if (element.doubleSide === true) material.side = THREE.DoubleSide;
                });
              } else {
                child.material.flatShading = true;
                if (element.doubleSide === true) child.material.side = THREE.DoubleSide;
              }
            }
          });

          World.LOADED_MODELS.set(element.name, object);
          // const box = new THREE.Box3().setFromObject(object);
          // const size = box.getSize(new THREE.Vector3(0, 0, 0));

          resolve(object);
        }, null, () => reject());
      }, null, () => reject());
    });
  }

  /**
  * Loads all textures
  * @return {Promise<any>}
  */
  private initTextures(): Promise<any> {
    const loader = new THREE.TextureLoader();

    return new Promise(resolve => {
      TEXTURES.forEach((texture: ITexture) => {
        if (!World.LOADED_TEXTURES.has(texture.name)) {
          const img = loader.load(texture.img);
          World.LOADED_TEXTURES.set(texture.name, img);
        }
      });
      resolve();
    });
  }

}

export const coreSvc = new CoreService();
export default CoreService;
