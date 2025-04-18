import { Game } from "../../scenes/Game";

type UnitCategory = "small" | "medium" | "large";

export class Unit extends Phaser.Physics.Arcade.Image {
  categoty: UnitCategory;
  hp = 100;
  fireRange: number;

  constructor(scene: Game, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.setScale(0.5);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.moveTo(this, 1024, 1024, 100);
    this.body.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
    this.postFX.addBloom(0xff0000, 1, 1, 1, 2);
  }

  getHit(damage: number) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.reset();
    }
  }

  reset() {
    this.setActive(true);
    this.setVisible(true);
  }
}
