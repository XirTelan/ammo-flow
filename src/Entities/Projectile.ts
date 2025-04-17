import { Scene } from "phaser";

export class Projectile extends Phaser.Physics.Arcade.Image {
  scene: Scene;
  
  constructor(scene: Scene, x: number, y: number) {
    super(scene, x, y, "projectile");
    this.setScale(0.2);
    this.scene = scene;
    console.log("ammo");
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
  initProj(x: number, y: number, speed: number, angle: number) {
    this.setActive(true);
    this.setVisible(true);
    this.setPosition(x, y);

    const physBody = this.body as Phaser.Physics.Arcade.Body;

    physBody.setVelocity(0, 0);
    physBody.setAcceleration(0);

    this.scene.physics.velocityFromRotation(
      angle,
      speed,
      physBody.velocity
    );
    this.rotation = angle;
  }

  update() {
    console.log("check");
    const physBody = this.body as Phaser.Physics.Arcade.Body;
    const vx = physBody.velocity.x;
    const vy = physBody.velocity.y;

    this.rotation = Math.atan2(vy, vx);
  }
}
