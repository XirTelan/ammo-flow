import { TurretStatus } from "@/helpers/types";
import { Game } from "../../scenes/Game";
import { Unit } from "../Units/Unit";
import { Turret } from "./Turret";

export class Artillery extends Turret {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "artillery", "default");
  }

  fire() {
    if (!this.target) return;
    // debugger;
    const targetUnit = this.target;
    const targetPos = targetUnit.body.center;
    const velocity = targetUnit.body.velocity;
    const distance = Phaser.Math.Distance.BetweenPoints(this, targetPos);
    const projectileSpeed = this.currentAmmoData.speed;

    const travelTime = distance / projectileSpeed;

    const predictedX = targetPos.x + velocity.x * travelTime;
    const predictedY = targetPos.y + velocity.y * travelTime;

    const predictedPoint = new Phaser.Math.Vector2(predictedX, predictedY);

    const spread = this.turretConfig.spread;
    const angleOffset = Phaser.Math.DegToRad(
      Phaser.Math.Between(-spread, spread)
    );

    const finalPoint = predictedPoint.clone().rotate(angleOffset);

    let angle = Phaser.Math.Angle.BetweenPoints(this, finalPoint);
    this.rotation = angle;
    this.status = TurretStatus.firing;

    const proj = this.scene.add.rectangle(this.x, this.y, 10, 10, 0xffffff);
    proj.postFX.addBloom(0xffffff, 1, 1, 1, 2);

    this.scene.tweens.add({
      targets: proj,
      x: predictedPoint.x,
      y: predictedPoint.y,
      ease: "Quad.easeInOut",
      duration: travelTime * 1000,
      onComplete: () => {
        proj.destroy();
        this.createExplosion(predictedPoint);
      },
    });

    this.ammoCount -= 1;
  }

  createExplosion(point: Phaser.Math.Vector2) {
    const radius = this.currentAmmoData.splashRadius;
    if (!radius) return;

    const explosion = this.scene.add.circle(
      point.x,
      point.y,
      radius,
      0xff0000,
      0.3
    );
    this.scene.time.delayedCall(200, () => explosion.destroy());

    const affectedUnits = this.scene.units.getChildren().filter((obj) => {
      const unit = obj as Unit;
      return (
        unit.active &&
        Phaser.Math.Distance.BetweenPoints(unit.body!.center, point) <= radius
      );
    });

    affectedUnits.forEach((obj) => {
      const unit = obj as Unit;
      unit.getHit(this.currentAmmoData.damage);
    });
  }
}
