import * as THREE from 'three';

import World from '@world/World';
import SoundManager from '@shared/SoundManager';

import { progressionSvc } from '@achievements/services/progression.service';
import { achievementSvc } from '@achievements/services/achievement.service';

import { IObject } from '@shared/models/object.model';
import { ITexture } from '@shared/models/texture.model';

import { OBJECTS } from '@shared/constants/object.constants';
import { TEXTURES } from '@shared/constants/texture.constants';

import Builder_Game_Item_Click_1 from '@sounds/Builder_Game_Item_Click_1.mp3';
import Unlock_level_Game_Sound from '@sounds/Unlock_level_Game_Sound.mp3';
import Set_Down_Item_1 from '@sounds/Set_Down_Item_1.mp3';
import Small_Splash from '@sounds/Small_Splash.mp3';
import Bubbles from '@sounds/Bubbles.mp3';
import Hehe_Boi from '@sounds/Hehe_Boi.mp3';
import Fairy_Meeting from '@sounds/Fairy_Meeting.mp3';
import Underwater from '@sounds/underwater.mp3';

import { VERSION_STORAGE } from '@app/Version';
import { STORAGES_KEY } from '@achievements/constants/storageKey.constants';
import { storageSvc } from '@shared/services/storage.service';
import { configSvc } from './config.service';
import { GraphicsQuality } from '../enums/graphicsQuality.enum';

class CoreService {

  async init(): Promise<any> {
    const storageVersion = storageSvc.get(STORAGES_KEY.version);
    if (storageVersion !== VERSION_STORAGE) {
      progressionSvc.reset();
      achievementSvc.reset();

      storageSvc.set(STORAGES_KEY.version, VERSION_STORAGE);
    }

    progressionSvc.init();

    await this.initModels();
    await this.initSounds();
    await this.initTextures();

    const sound = SoundManager.get('background_music');
    sound.play();
    sound.fade(0, sound.volume(), 5000);
  }

  private async initSounds(): Promise<any> {
    await SoundManager.add('click', Builder_Game_Item_Click_1, { volume: 1.0 });
    await SoundManager.add('trophy_unlock', Unlock_level_Game_Sound, { volume: 1.0 });
    await SoundManager.add('set_down', Set_Down_Item_1, { volume: 1.0 });
    await SoundManager.add('splash', Small_Splash, { volume: 1.0 });
    await SoundManager.add('bubbles', Bubbles, { volume: 1.0 });
    await SoundManager.add('hehe', Hehe_Boi, { volume: 1.0 });
    await SoundManager.add('background_music', Fairy_Meeting, { volume: 0.25, loop: true, pool: 1 });
    await SoundManager.add('underwater', Underwater, { volume: 0.5, loop: true, pool: 1 });
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
          object.receiveShadow = configSvc.config.OBJECT_RECEIVE_SHADOW;
          object.frustumCulled = true;

          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = configSvc.config.OBJECT_RECEIVE_SHADOW;
              child.frustumCulled = true;

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

          object.userData.stackReference = element.name;
          object.userData.type = element.type;

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
