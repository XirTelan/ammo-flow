import { Projectile } from "../../Projectile";
import { Game } from "../../scenes/Game";
import { AmmoVariant, TurretConfig, TurretType } from "../../helpers/types";
import { colors } from "@/helpers/config";
import { Warehouse } from "../Player/Warehouse";

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

  private _ammoCount: number = 1000;
  ammoType: string;

  private _status: TurretStatus = TurretStatus.idle;
  fireRangeCircle: Phaser.GameObjects.Graphics;

  constructor(
    scene: Game,
    x: number,
    y: number,
    turretType: TurretType,
    ammoType: string
  ) {
    super(scene, x, y, turretType);
    this.scene = scene;

    scene.add.existing(this);

    this.pos = { x, y };

    this.turretType = turretType;
    this.turretConfig = scene.cache.json.get("turrets")[turretType];

    this.ammoType = ammoType;
    this.fireRangeCircle = this.scene.add.graphics();

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
    this.emit("ammoChange", this._ammoCount);
  }

  get fireRange() {
    return (
      this.turretConfig.range +
      this.turretConfig.range * this.currentAmmoData.rangeMod
    );
  }

  fire() {
    let angle = Phaser.Math.Angle.BetweenPoints(
      this,
      this.target?.body?.center
    );
    if (angle === null) return;

    const spread = this.turretConfig.spread;
    angle = angle + Phaser.Math.DegToRad(Phaser.Math.Between(-spread, spread));
    this.rotation = angle;
    const proj: Projectile = this.scene.projectiles.getFirstDead(
      true,
      this.x,
      this.y,
      "projectile"
    );
    this.status = TurretStatus.firing;

    proj.initProj(this.x, this.y, angle, this.currentAmmoData);
    this.ammoCount = this.ammoCount - 1;
  }

  setAmmoType(ammoType: string) {
    const ammoData = this.warehouse.getAmmoStats(this.turretType, ammoType);
    if (!ammoData) return;

    this.currentAmmoData = ammoData;
  }
  preUpdate(_: number, delta: number) {
    this.fireCooldown -= delta / 1000;
    this.emit("cd", this.fireCooldown / this.turretConfig.fireRate);

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

    if (!this.target.active || distance > this.fireRange) {
      this.target = undefined;
      return;
    }

    if (this.fireCooldown > 0) return;

    this.fire();
    this.fireCooldown = this.turretConfig.fireRate;
  }
  showFireRange() {
    this.fireRangeCircle.lineStyle(4, colors.backgroundAccent.number, 0.8);
    this.fireRangeCircle.strokeCircle(this.pos.x, this.pos.y, this.fireRange);
    this.fireRangeCircle.lineStyle(2, colors.backgroundAccent.number, 0.5);
    this.fireRangeCircle.lineBetween(
      this.pos.x,
      this.pos.y,
      this.pos.x - this.fireRange,
      this.pos.y
    );
    this.fireRangeCircle.lineBetween(
      this.pos.x,
      this.pos.y,
      this.pos.x + this.fireRange,
      this.pos.y
    );
    this.fireRangeCircle.lineBetween(
      this.pos.x,
      this.pos.y,
      this.pos.x,
      this.pos.y - this.fireRange
    );
    this.fireRangeCircle.lineBetween(
      this.pos.x,
      this.pos.y,
      this.pos.x,
      this.pos.y + this.fireRange
    );
  }
  hideFireRange() {
    this.fireRangeCircle.clear();
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
}
