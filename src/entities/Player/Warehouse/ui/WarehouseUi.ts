import { TurretType } from "@/helpers/types";
import Phaser from "phaser";
import { Warehouse } from "../Warehouse";
import { colors } from "@/helpers/config";
import { BaseButton } from "@/shared/ui/BaseButton";

const STARTX = 530;
const startY = 1200;
const COLUMNSPACING = 180;
const LINEHEIGHT = 20;
const VALUESPACING = 130;

export class WarehouseUI {
  private scene: Phaser.Scene;
  private warehouse: Warehouse;
  private container: Phaser.GameObjects.Container;
  private isVisible = true;

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

  constructor(scene: Phaser.Scene, warehouse: Warehouse) {
    this.scene = scene;
    this.warehouse = warehouse;
    this.container = this.scene.add.container(STARTX, startY);
    this.scene.add.image(0, 995, "warehousePanel").setDepth(10).setOrigin(0);
    this.createUI();
    this.createToggleButton();
  }

  private createUI() {
    const inventory = this.warehouse.getAll();
    const turretTypes = Object.keys(inventory) as TurretType[];

    const graphics = this.scene.add.graphics();
    graphics.lineStyle(4, 0xffffff);

    this.container.add([
      this.scene.add
        .rectangle(-20, -20, 910, 600, colors.overlay.number)
        .setOrigin(0),
      graphics,
    ]);

    turretTypes.forEach((turret, index) => {
      const x = index * COLUMNSPACING;
      let y = 0;

      const titleBg = this.scene.add.rectangle(
        x - 5,
        y - 2,
        160,
        LINEHEIGHT + 4,
        0xffffff
      );
      titleBg.setOrigin(0, 0);

      const titleText = this.scene.add.text(x, y, turret.toUpperCase(), {
        font: "16px",
        color: "#000000",
      });

      this.container.add([titleBg, titleText]);
      y += LINEHEIGHT;

      for (const variant in inventory[turret]) {
        const count = this.warehouse.getAmmoCount(turret, variant);

        const label = this.scene.add.text(
          x + 20,
          y + 10,
          `${variant.toUpperCase()}:`,
          {
            font: "14px",
            color: colors.textPrimary.hex,
          }
        );

        graphics.lineBetween(x - 3, y + 20, x - 3, y - 20);
        graphics.lineBetween(x + 15, y + 18, x - 3, y + 18);

        const valueText = this.scene.add.text(
          x + 25 + VALUESPACING,
          y + 10,
          `${count}`,
          {
            font: "bold 18px monospace",
            color: "#fff",
            align: "right",
          }
        );
        valueText.setOrigin(1, 0);

        this.ammoTexts[turret][variant] = valueText;

        this.warehouse.events.on(`${turret}.${variant}`, (newCount: number) => {
          valueText.setText(`${newCount}`);
        });

        this.container.add([label, valueText]);
        y += LINEHEIGHT;
      }
    });
    this.container.add(
      this.scene.add.image(-25, -25, "warehouseScreen").setOrigin(0)
    );
  }

  private createToggleButton() {
    const toggleButton = new BaseButton(
      this.scene,
      459,
      1048,
      "warehouseToggle",
      "warehouseToggle_over",
      "warehouseToggle_pressed"
    );

    toggleButton.baseImage.on("pointerup", this.toggleContainer, this);
  }

  private toggleContainer() {
    const targetY = this.isVisible
      ? this.container.y - 250
      : this.container.y + 250;
    this.scene.tweens.add({
      targets: this.container,
      y: targetY,
      duration: 400,
      ease: "Sine.easeInOut",
    });
    this.isVisible = !this.isVisible;
  }
}
