import { Scene } from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Image {
  scene: Scene;

  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "projectile");
    this.setScale(0.5);
    this.scene = scene;
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.postFX.addBloom(0x0ffffff, 1, 1, 1.5, 4);
  }
  initProj(x: number, y: number, speed: number, angle: number) {
    this.enableBody(true, x, y);
    this.setActive(true);
    this.setVisible(true);

    const physBody = this.body as Phaser.Physics.Arcade.Body;

    physBody.setVelocity(0, 0);
    physBody.setAcceleration(0);
    physBody.onWorldBounds = true;
    this.scene.physics.velocityFromRotation(angle, speed, physBody.velocity);
    this.rotation = angle;
  }

  update() {
    const physBody = this.body as Phaser.Physics.Arcade.Body;
    const vx = physBody.velocity.x;
    const vy = physBody.velocity.y;

    this.rotation = Math.atan2(vy, vx);
  }
}
