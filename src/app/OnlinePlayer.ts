import * as THREE from 'three';
import { SpriteText2D, textAlign } from 'three-text2d';

class OnlinePlayer {
  private id: string;
  private name: string;
  private color: THREE.Color | string;
  private model: THREE.Object3D;
  private tag: SpriteText2D;

  constructor(id: string, name: string, color: THREE.Color | string) {
    this.id = id;
    this.name = name;
    this.color = color;
  }

  init(scene: THREE.Scene) {
    // model
    const geometry = new THREE.IcosahedronGeometry(1000, 0);
    const material = new THREE.MeshLambertMaterial({
      color: this.color,
      flatShading: true
    });

    this.model = new THREE.Mesh(geometry, material);

    // tag
    this.tag = new SpriteText2D(this.name.toUpperCase(), {
      align: textAlign.center,
      font: 'bold 1000px Arial',
      fillStyle: '#ffffff',
      antialias: true
    });
    this.tag.material.alphaTest = 0.1;

    scene.add(this.model);
    scene.add(this.tag);
  }

  update(position: THREE.Vector3) {
    if (position instanceof THREE.Vector3) {
      this.model.position.copy(position);

      // update tag position
      const textPosition = position.clone();
      textPosition.y += 2048;
      this.tag.position.copy(textPosition);
    }
  }

  clean(scene: THREE.Scene) {
    scene.remove(this.model);
    scene.remove(this.tag);
  }
}

export default OnlinePlayer;
