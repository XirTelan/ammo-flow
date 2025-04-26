import { Game } from "../../scenes/Game";
import { Turret } from "./Turret";
import { Unit } from "../Units/Unit";
import { TurretStatus } from "@/helpers/types";
import { Physics } from "phaser";
import { Warehouse } from "../Player/Warehouse";

export class PlasmaCannon extends Turret {
  private beam: Phaser.GameObjects.Graphics;
  private beamTween?: Phaser.Tweens.Tween;

  constructor(scene: Game, warehouse: Warehouse, x: number, y: number) {
    super(scene, warehouse, x, y, "plasmaCannon", "default");
    this.beam = scene.add.graphics();
  }

  fire() {
    if (!this.target) return;
    const physBody = this.target.body as Physics.Arcade.Body;

    const angle = Phaser.Math.Angle.BetweenPoints(this, physBody.center);

    this.status = TurretStatus.firing;
    this.rotation = angle;

    const beamLength = this.fireRange;
    const beamEndX = this.x + Math.cos(angle) * beamLength;
    const beamEndY = this.y + Math.sin(angle) * beamLength;

    this.drawBeam(this.x, this.y, beamEndX, beamEndY);

    this.dealDamageInPath(this.x, this.y, beamEndX, beamEndY);
    this.ammoCount -= 1;
  }

  private drawBeam(startX: number, startY: number, endX: number, endY: number) {
    this.beam.clear();

    this.beam.setAlpha(1);

    this.beam.lineStyle(12, 0xffffff, 1);
    this.beam.beginPath();
    this.beam.moveTo(startX, startY);
    this.beam.lineTo(endX, endY);
    this.beam.strokePath();

    this.beam.lineStyle(24, 0xffffff, 0.6);
    this.beam.beginPath();
    this.beam.moveTo(startX, startY);
    this.beam.lineTo(endX, endY);
    this.beam.strokePath();

    this.beamTween?.remove();

    this.beamTween = this.scene.tweens.add({
      targets: this.beam,
      alpha: 0,
      duration: 200,
      ease: "Power2",
    });
  }
  private dealDamageInPath(
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ) {
    const affectedUnits = this.scene.units.getChildren().filter((obj) => {
      const unit = obj as Unit;
      if (!unit.body?.center) return;
      return (
        unit.active &&
        this.isUnitInLinePath(unit.body.center, startX, startY, endX, endY)
      );
    });

    affectedUnits.forEach((obj) => {
      const unit = obj as Unit;
      unit.getHit(this.currentAmmoData.damage);
    });
  }

  private isUnitInLinePath(
    unitPos: Phaser.Math.Vector2,
    startX: number,
    startY: number,
    endX: number,
    endY: number
  ): boolean {
    const lineStart = new Phaser.Math.Vector2(startX, startY);
    const lineEnd = new Phaser.Math.Vector2(endX, endY);
    const unitPosVec = unitPos;

    const lineLength = lineStart.distance(lineEnd);
    const dist = Phaser.Math.Distance.BetweenPoints(unitPosVec, lineStart);
    const lineToUnit = Phaser.Math.Distance.BetweenPoints(unitPosVec, lineEnd);

    const threshold = 50;

    return dist + lineToUnit <= lineLength + threshold;
  }
}
