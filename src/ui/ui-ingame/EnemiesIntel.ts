import { Commander } from "../../Entities/Enemy/Commander";
import { Game } from "../../scenes/Game";

class EnemiesIntel {
  commander: Commander;
  gameScene: Game;
  panels: Phaser.GameObjects.Container;
  constructor(scene: Game) {
    this.gameScene;
    this.commander = scene.commander;
  }
  addUnitPanel() {
    const container = this.gameScene.add.container();
  }
}
