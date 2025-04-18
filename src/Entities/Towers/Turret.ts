import { Projectile } from "../Projectile";
import { Game } from "../../scenes/Game";
import { Warehouse } from "../Player/Warehouse";
import { AmmoVariant, TurretConfig, TurretType } from "../../helpers/types";
import { drawTrajectory } from "../../helpers/utils";

enum TurretStatus {
  "firing",
  "idle",
  "empty",
}

export class Turret extends Phaser.GameObjects.Image {
  scene: Game;

  private warehouse: Warehouse = Warehouse.getInstance();

  pos;
  target?: Phaser.GameObjects.GameObject;
  events = new Phaser.Events.EventEmitter();
  turretConfig: TurretConfig;
  turretType: TurretType;

  fireCooldown: number = 0;

  currentAmmoData: AmmoVariant;

  ammoCount: number = 10;
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

  set status(value: TurretStatus) {
    if (this._status === value) return;
    this._status = value;
  }

  fire() {
    console.log("fire");
    const angle = Phaser.Math.Angle.BetweenPoints(
      this,
      this.target?.body?.center
    );
    console.log("fire", angle);
    if (angle === null) return;
    this.rotation = angle;
    console.log("rotation", this.rotation, angle);
    const proj: Projectile = this.scene.projectiles.getFirstDead(
      true,
      this.x,
      this.y,
      "projectile"
    );
    console.log("Firing angle (deg):", Phaser.Math.RadToDeg(angle));

    proj.initProj(this.x, this.y, this.currentAmmoData.speed, angle);
    this.ammoCount--;

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
    if (!this.target.active) {
      this.target = undefined;
    }

    if (!this.target) {
      this.status = TurretStatus.idle;
    }

    if (this.fireCooldown > 0) return;

    this.fire();
    this.fireCooldown = this.turretConfig.fireRate;
  }

  findTarget() {
    const closestEnemy = this.scene.physics.closest(
      this,
      this.scene.units
        .getChildren()
        .filter(
          (obj) =>
            obj.active &&
            Phaser.Math.Distance.BetweenPoints(obj.body?.position, this) <
              this.turretConfig.range
        )
    );
    if (closestEnemy) this.target = closestEnemy;
  }
}
