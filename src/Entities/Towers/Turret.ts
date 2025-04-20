import { Projectile } from "../Projectile";
import { Game } from "../../scenes/Game";
import { Warehouse } from "../Player/Warehouse";
import { AmmoVariant, TurretConfig, TurretType } from "../../helpers/types";
import { drawTrajectory } from "../../helpers/utils";
import { Physics } from "phaser";

enum TurretStatus {
  "firing",
  "idle",
  "empty",
}

enum EventTypes {
  "ammoChange",
  "statusChange",
}

export class Turret extends Phaser.GameObjects.Image {
  scene: Game;

  private warehouse: Warehouse = Warehouse.getInstance();
  pos;
  target?: Phaser.GameObjects.GameObject;
  turretConfig: TurretConfig;
  turretType: TurretType;

  fireCooldown: number = 0;

  currentAmmoData: AmmoVariant;

  private _ammoCount: number = 10;
  ammoType: string;

  private _status: TurretStatus = TurretStatus.idle;

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

    this.turretType = turretType;
    this.turretConfig = scene.cache.json.get("turrets")[turretType];

    this.ammoType = ammoType;

    this.scene = scene;

    this.setAmmoType(ammoType);
  }
  get status(): string {
    return TurretStatus[this._status].toLocaleUpperCase();
  }
  set status(value: TurretStatus) {
    if (this._status === value) return;
    this._status = value;
    this.emit("statusChange", this.status);
  }

  get ammoCount() {
    return this._ammoCount;
  }
  set ammoCount(value: number) {
    this._ammoCount = value;
    this.emit("ammoChange", this.getAmmoStatus());
  }

  get fireRange() {
    return (
      this.turretConfig.range +
      this.turretConfig.range * this.currentAmmoData.rangeMod
    );
  }

  fire() {
    const angle = Phaser.Math.Angle.BetweenPoints(
      this,
      this.target?.body?.center
    );
    if (angle === null) return;
    this.rotation = angle;
    const proj: Projectile = this.scene.projectiles.getFirstDead(
      true,
      this.x,
      this.y,
      "projectile"
    );
    this.status = TurretStatus.firing;
    // console.log("Firing angle (deg):", Phaser.Math.RadToDeg(angle));

    proj.initProj(this.x, this.y, angle, this.currentAmmoData);
    this.ammoCount = this.ammoCount - 1;

    drawTrajectory(
      this.scene,
      this.x,
      this.y,
      angle,
      this.currentAmmoData.speed,
      0
    );
  }

  setAmmoType(ammoType: string) {
    const ammoData = this.warehouse.getAmmoStats(this.turretType, ammoType);
    if (!ammoData) return;

    this.currentAmmoData = ammoData;
    console.log("current Ammo data", this.currentAmmoData);
  }
  preUpdate(time: number, delta: number) {
    this.fireCooldown -= delta / 1000;

    if (this.ammoCount == 0) {
      this.status = TurretStatus.empty;
      return;
    }
    if (!this.target) {
      this.findTarget();
    }

    if (!this.target) {
      this.status = TurretStatus.idle;
      return;
    }
    const distance = Phaser.Math.Distance.BetweenPoints(
      this.target.body?.center,
      this.pos
    );

    // console.log("distance", distance);
    if (!this.target.active || distance > this.fireRange) {
      this.target = undefined;
      this.status = TurretStatus.idle;
      return;
    }

    if (this.fireCooldown > 0) return;

    this.fire();
    this.fireCooldown = this.turretConfig.fireRate;
  }

  private findTarget() {
    const closestEnemy = this.scene.physics.closest(
      this,
      this.scene.units
        .getChildren()
        .filter(
          (obj) =>
            obj.active &&
            Phaser.Math.Distance.BetweenPoints(obj.body?.center, this.pos) <
              this.fireRange
        )
    );
    if (closestEnemy) this.target = closestEnemy;
  }

  getAmmoStatus() {
    return `${this.ammoCount}/${this.turretConfig.ammoMaxLoad}`;
  }
}
