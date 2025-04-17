import { Game } from "../../scenes/Game";

type UnitCategory = "small" | "medium" | "large";

export class Unit extends Phaser.GameObjects.Image {
  categoty: UnitCategory;
  hp = 100;
  fireRange: number;

  constructor(scene: Game, x: number, y: number, texture: string) {
    super(scene, x, y, texture);
    this.setScale(0.5);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    scene.physics.moveTo(this, 0, this.y, 100);
    this.body.setAllowGravity(false);
    this.body.setImmovable(true);
  }

  init() {}

  update() {
    console.log("unit");
    if (this.x < 0 || this.x > this.scene.scale.width + this.width) {
      this.setActive(false);
      this.setVisible(false);
    }
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
