import { Game } from "@/scenes/Game";

type UnitCategory = "small" | "medium" | "large" | "air";

export class Unit extends Phaser.Physics.Arcade.Image {
  categoty: UnitCategory;
  hp = 100;
  fireRange: number;

  constructor(scene: Game, x: number, y: number, texture: string) {
    super(scene, x, y, `u_${texture}`);
    this.setScale(0.5);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    const physBody = this.body as Phaser.Physics.Arcade.Body;
    physBody.setCollideWorldBounds(true);
    physBody.onWorldBounds = true;
    physBody.setAllowGravity(false);
    physBody.setImmovable(true);
  }

  initState(scene: Game, x: number, y: number) {
    this.enableBody(true, x, y);
    this.setActive(true);
    this.setVisible(true);
    scene.physics.moveTo(this, 1024, 1024, 100);
  }

  getHit(damage: number) {
    this.hp -= damage;
    if (this.hp <= 0) {
      this.reset();
    }
  }

  reset() {
    this.emit("destroy");
    this.body?.stop();
    this.setActive(false);
    this.setVisible(false);
  }
}
