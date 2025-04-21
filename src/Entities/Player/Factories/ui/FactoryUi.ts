import { Scene } from "phaser";
import { Factory } from "../Factory";

export class FactoryUi {
  container: Phaser.GameObjects.Container;
  factory: Factory;
  constructor(scene: Scene, x: number, y: number, factory: Factory) {
    this.factory = factory;
    this.container = scene.add.container(x, y);
    this.container.add([
      scene.add.rectangle(0, 0, 370, 150, 0xdfd6c5).setOrigin(0),
      scene.add.rectangle(370, 0, 150, 150, 0x000000).setOrigin(0),
    ]);
  }

  changeTask() {}
}
