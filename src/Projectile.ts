import { Scene } from "phaser";
import { AmmoVariant } from "./helpers/types";

export class Projectile extends Phaser.Physics.Arcade.Image {
  scene: Scene;
  ammoData: AmmoVariant;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "projectile");
    this.setScale(0.5);
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);

  }
  initProj(x: number, y: number, angle: number, ammoData: AmmoVariant) {
    this.enableBody(true, x, y);
    this.setActive(true);
    this.setVisible(true);
    this.ammoData = ammoData;

    const physBody = this.body as Phaser.Physics.Arcade.Body;
    physBody.setSize(20, 20);
    physBody.setVelocity(0, 0);
    physBody.setAcceleration(0);
    physBody.onWorldBounds = true;
    this.scene.physics.velocityFromRotation(
      angle,
      ammoData.speed,
      physBody.velocity
    );
    this.rotation = angle;
    this.scene.time.addEvent({
      delay: 100,
      callback: this.updateRotation,
      callbackScope: this,
      loop: true,
    });
  }

  updateRotation() {
    const physBody = this.body as Phaser.Physics.Arcade.Body;
    const vx = physBody.velocity.x;
    const vy = physBody.velocity.y;

    this.rotation = Math.atan2(vy, vx);
  }

  disable() {
    this.disableBody();
    this.setActive(false);
    this.setVisible(false);
  }
}
