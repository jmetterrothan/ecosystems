import * as THREE from 'three';

import SceneWrapper from './SceneWrapper/SceneWrapper';
import Utils from './Shared/Utils';

class Main {

  private sceneWrapper: SceneWrapper = new SceneWrapper();

  scene: THREE.Scene;

  async bootstrap() {
    this.scene = await this.sceneWrapper.init();
  }

}

export default Main;
