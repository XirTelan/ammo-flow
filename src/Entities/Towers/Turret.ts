import { Projectile } from "../Projectile";
import { Game } from "../../scenes/Game";
import { drawTrajectory } from "../../helpers/utils";
import { GRAVITY } from "../../helpers/config";
import { Warehouse } from "../Player/Warehouse";
import { AmmoVariant, TurretType } from "../../helpers/types";

export class Turret extends Phaser.GameObjects.Image {
  scene: Game;
  fireCooldown: number = 0;
  fireRate: number = 1;
  warehouse: Warehouse;
  pos;
  target?: Phaser.GameObjects.GameObject;

  turretType: TurretType;
  ammoCount: number;
  ammoType: string;
  currentAmmoData: AmmoVariant;

  constructor(
    scene: Game,
    x: number,
    y: number,
    turretType: TurretType,
    ammoType: string
  ) {
    super(scene, x, y, turretType);
    scene.add.existing(this);
    this.pos = { x, y };
    this.warehouse = Warehouse.getInstance();
    this.turretType = turretType;
    this.ammoType = ammoType;
    this.scene = scene;

    this.setAmmoType(ammoType);
  }

  fire() {
    console.log("fire");

    const angle = Phaser.Math.Angle.BetweenPoints(
      this,
      this.target?.body?.position
    );

    if (angle === null) return;
    this.rotation = angle;
    const proj: Projectile = this.scene.projectiles.getFirstDead(
      true,
      this.x,
      this.y,
      "projectile"
    );
    console.log("Firing angle (deg):", Phaser.Math.RadToDeg(angle));

    proj.initProj(this.x, this.y, this.currentAmmoData.speed, angle);

    // drawTrajectory(
    //   this.scene,
    //   this.x,
    //   this.y,
    //   angle,
    //   this.currentAmmoData.speed,
    //   GRAVITY
    // );
    this.warehouse.consumeAmmo(this.turretType, this.ammoType, 1);
  }

  setAmmoType(ammoType: string) {
    const ammoData = this.warehouse.getAmmoStats(this.turretType, ammoType);
    if (!ammoData) return;

    this.currentAmmoData = ammoData;
    console.log("current Ammo data", this.currentAmmoData);
  }

  update(time: number, delta: number) {
    this.fireCooldown -= delta / 1000;

    if (!this.target) {
      this.findTarget();
    }
    if (!this.target) return;
    if (!this.target.active) {
      this.target = undefined;
    }
    const ammoCount = this.warehouse.getAmmoCount(
      this.turretType,
      this.ammoType
    );
    if (!this.target) return;
    console.log("1", ammoCount);
    if (ammoCount == 0) return;
    console.log("2");

    if (this.fireCooldown > 0) return;

    this.fire();
    this.fireCooldown = this.fireRate;
  }

  findTarget() {
    // console.log("search...");
    const closestEnemy = this.scene.physics.closest(
      this,
      this.scene.units.getChildren().filter((obj) => obj.active)
    );
    // console.log("search result", closestEnemy);
    if (closestEnemy) this.target = closestEnemy;
  }
}
