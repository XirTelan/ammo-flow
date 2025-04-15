import { Projectile } from "../Projectile";
import { Game } from "../../scenes/Game";
import { drawTrajectory, getFiringAngle } from "../../helpers/utils";
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
  ammoType: string;
  currentAmmoData: AmmoVariant;

  constructor(
    scene: Game,
    x: number,
    y: number,
    turretType: TurretType,
    ammoType: string
  ) {
    super(scene, x, y, "");
    this.pos = { x, y };
    this.warehouse = Warehouse.getInstance();
    this.turretType = turretType;
    this.ammoType = ammoType;
    this.scene = scene;

    scene.add.rectangle(x, y, 50, 50, 0xff0000);

    this.setAmmoType(ammoType);
  }

  fire() {
    console.log("fire");

    console.log("ammodata");

    const angle = calculateFiringAngle(
      new Phaser.Math.Vector2(this.x, this.y),
      this.target?.body?.position,
      this.currentAmmoData.speed,
      GRAVITY,
      true
    );

    // const angle = getFiringAngle(
    //   this.x,
    //   this.y,
    //   predicted.x,
    //   predicted.y,
    //   this.currentAmmoData.speed,
    //   GRAVITY
    // );
    // const angle = Phaser.Math.Angle.Between(
    //   this.x,
    //   this.y,
    //   predicted.x,
    //   predicted.y
    // );
    console.log("angle", angle);

    if (angle === null) return;

    const proj: Projectile = this.scene.projectiles.get(
      this.x,
      this.y,
      "projectile"
    );
    console.log("Firing angle (deg):", Phaser.Math.RadToDeg(-angle));
    // angle in radians
    // this.scene.add.circle(predicted.x, predicted.y, 4, 0xff0000);

    proj.initProj(this.x, this.y, this.currentAmmoData.speed, -angle);

    drawTrajectory(
      this.scene,
      this.x,
      this.y,
      -angle,
      this.currentAmmoData.speed,
      GRAVITY
    ); // 💥
    this.warehouse.consumeAmmo(this.turretType, this.ammoType, 1);
    // const p = this.projectiles.get(x, y, "bullet");
    // new Projectile(this.scene, this.pos.x + 50, this.pos.y);
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

function calculateFiringAngle(
  firePoint: Phaser.Math.Vector2,
  targetPoint: Phaser.Math.Vector2,
  firePower: number,
  gravity: number,
  low: boolean
): number | null {
  const v = firePower;
  const g = gravity;

  console.log(firePoint, targetPoint);

  const y = firePoint.y - targetPoint.y;

  const x = Math.abs(targetPoint.x - firePoint.x);

  console.log(`Y: ${y} / X: ${x}`);
  console.log(`World pos: target ${targetPoint} / firePoint ${firePoint}`);

  let sqrt = v * v * v * v - g * (g * x * x + 2 * y * v * v);
  if (sqrt < 0) {
    return null;
  }

  sqrt = Math.sqrt(sqrt);

  const angleMaxRad = Math.atan((v * v + sqrt) / (g * x));
  const angleMinRad = Math.atan((v * v - sqrt) / (g * x));

  return low ? angleMinRad : angleMaxRad;
}
