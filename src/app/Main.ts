import * as THREE from 'three';

import SceneWrapper from './SceneWrapper/SceneWrapper';

class Main {

  private sceneWrapper: SceneWrapper = new SceneWrapper();

  scene: THREE.Scene;

  async bootstrap() {
    this.scene = await this.sceneWrapper.init();
    console.log(this.scene);
  }
}

export default Main;
