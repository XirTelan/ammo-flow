import { UnitConfig } from "@/helpers/types";
import { Projectile } from "@/Projectile";
import { Game } from "@/scenes/Game";
import { Physics } from "phaser";

type UnitCategory = "small" | "medium" | "large" | "air";

export class Unit extends Phaser.Physics.Arcade.Image {
  categoty: UnitCategory;
  scene: Game;

  unitConfig: UnitConfig;

  canFire: boolean = true;
  target: Phaser.GameObjects.Rectangle;

  constructor(scene: Game, x: number, y: number, texture: string) {
    super(scene, x, y, `u_${texture}`);
    this.scene = scene;

    scene.add.existing(this);
    scene.physics.add.existing(this);
    const physBody = this.body as Phaser.Physics.Arcade.Body;
    physBody.setCollideWorldBounds(true);
    physBody.onWorldBounds = true;
    physBody.setAllowGravity(false);
    physBody.setImmovable(true);
  }

  initState(
    target: Phaser.GameObjects.Rectangle,
    x: number,
    y: number,
    type: string,
    unitConfig: UnitConfig
  ) {
    this.target = target;
    this.unitConfig = unitConfig;
    this.setTexture(`u_${type}`);
    this.enableBody(true, x, y);
    this.setActive(true);
    this.setVisible(true);
  }

  update() {
    if (!this.active || !this.target) return;

    const distance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      this.target.x,
      this.target.y
    );

    let angle = Phaser.Math.Angle.BetweenPoints(this, this.target.getCenter());
    this.rotation = angle;

    if (distance > this.unitConfig.fireRange) {
      this.scene.physics.moveTo(
        this,
        this.target.x,
        this.target.y,
        this.unitConfig.speed
      );
    } else {
      const physBody = this.body as Phaser.Physics.Arcade.Body;
      physBody.velocity.set(0);
      if (this.canFire) {
        this.fire();
      }
    }
  }

  fire() {
    this.canFire = false;
    const physBody = this.target.body as Physics.Arcade.Body;

    let angle = Phaser.Math.Angle.BetweenPoints(this, physBody.center);

    const proj: Projectile = this.scene.enemyProjectiles.getFirstDead(
      true,
      this.x,
      this.y,
      "projectile"
    );
    angle = angle + Phaser.Math.DegToRad(Phaser.Math.Between(-5, 5));

    proj.initProj(this.x, this.y, angle, {
      speed: 100,
      damage: this.unitConfig.damage,
      rangeMod: 0,
      type: this.unitConfig.type,
    });

    this.scene.time.delayedCall(this.unitConfig.fireRate * 1000, () => {
      this.canFire = true;
    });
  }

  getHit(damage: number) {
    this.unitConfig.hp -= damage;
    if (this.unitConfig.hp <= 0) {
      this.reset();
    }
  }

  reset() {
    this.emit("destroy");
    this.disableBody(true);
    this.setActive(false);
    this.setVisible(false);
  }
}
