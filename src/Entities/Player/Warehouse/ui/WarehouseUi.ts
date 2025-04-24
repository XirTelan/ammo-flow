import { TurretType } from "@/helpers/types";
import Phaser from "phaser";
import { Warehouse } from "../Warehouse";

export class WarehouseUI {
  private scene: Phaser.Scene;
  private warehouse: Warehouse;

  private ammoTexts: Record<
    TurretType,
    Record<string, Phaser.GameObjects.Text>
  > = {
    machineGun: {},
    plasmaCannon: {},
    flakCannon: {},
    railgun: {},
    artillery: {},
  };

  private columnX = [50, 250];
  private startY = 720;
  private lineHeight = 20;
  private valueWidth = 60;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    this.warehouse = Warehouse.getInstance();
    this.createUI();
  }

  private createUI() {
    const inventory = this.warehouse.getAll();
    const turretTypes = Object.keys(inventory) as TurretType[];

    const half = Math.ceil(turretTypes.length / 2);

    const columns: TurretType[][] = [
      turretTypes.slice(0, half),
      turretTypes.slice(half),
    ];

    columns.forEach((columnTurrets, colIndex) => {
      let y = this.startY;

      for (const turret of columnTurrets) {
        this.scene.add.text(this.columnX[colIndex], y, turret.toUpperCase(), {
          font: "16px Arial",
          color: "#ffffff",
        });
        y += this.lineHeight;

        for (const variant in inventory[turret]) {
          const count = this.warehouse.getAmmoCount(turret, variant);

          this.scene.add.text(this.columnX[colIndex] + 10, y, `${variant}:`, {
            font: "14px Arial",
            color: "#aaaaaa",
          });

          const valueText = this.scene.add.text(
            this.columnX[colIndex] + 10 + this.valueWidth,
            y,
            `${count}`,
            {
              font: "14px Arial",
              color: "#ffffff",
              align: "right",
            }
          );
          valueText.setOrigin(1, 0); // Right-align

          this.ammoTexts[turret][variant] = valueText;

          this.warehouse.events.on(
            `${turret}.${variant}`,
            (newCount: number) => {
              valueText.setText(`${newCount}`);
            }
          );

          y += this.lineHeight;
        }

        y += this.lineHeight; // extra space between turret types
      }
    });
  }
}
