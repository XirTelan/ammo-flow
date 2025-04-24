import { Scene } from "phaser";
import { Commander } from "../Commander";

import { colors } from "../../../helpers/config";
import { NextWave, UnitConfig, UnitType } from "../../../helpers/types";

export class EnemiesIntel {
  commander: Commander;
  scene: Scene;
  panels: Phaser.GameObjects.Container;

  unitsConfig: UnitConfig;

  constructor(scene: Scene, commander: Commander) {
    this.scene = scene;
    this.commander = commander;
    this.unitsConfig = scene.cache.json.get("units");

    this.commander.events.on("nextWave", this.showInfo, this);
    this.scene.add.rectangle(1475, 80, 450, 40, 0xf4f4f6).setOrigin(0);
    this.scene.add.text(1495, 85, "NEXT WAVE INTEL:", {
      color: "#2c2c2c",
      fontSize: "24px",
      fontStyle: "bold",
    });
    this.scene.add
      .rectangle(1480, 120, 430, 200, colors.overlay.number)
      .setOrigin(0);
    this.showInfo(this.commander.nextWave);
  }
  showInfo(wave: NextWave) {
    if (this.panels) this.panels.destroy();

    this.panels = this.scene.add.container(1485, 120);

    const { units } = wave;
    let i = 0;
    for (const [key, count] of Object.entries(units)) {
      if (count == 0) continue;
      const container = this.scene.add.container(0, i * 50);
      container.add([
        this.scene.add
          .rectangle(0, 0, 400, 50, colors.overlay.number)
          .setOrigin(0),
        this.scene.add.image(10, 10, `u_${key}`).setOrigin(0).setScale(0.5),
        this.scene.add.text(
          50,
          5,
          `HP: ${this.unitsConfig[key as UnitType].hp}`,
          {
            fontSize: "18px",
            fontStyle: "bold",
            color: colors.textPrimary.hex,
          }
        ),
        this.scene.add.text(
          150,
          5,
          `RNG: ${this.unitsConfig[key as UnitType].range}`,
          {
            fontSize: "18px",
            fontStyle: "bold",
            color: colors.textPrimary.hex,
          }
        ),
        this.scene.add.text(
          50,
          25,
          `DMG: ${this.unitsConfig[key as UnitType].damage}`,
          {
            fontSize: "18px",
            fontStyle: "bold",
            color: colors.textPrimary.hex,
          }
        ),
        this.scene.add.text(
          150,
          25,
          `ARM: ${this.unitsConfig[key as UnitType].armor}`,
          {
            fontSize: "18px",
            fontStyle: "bold",
            color: colors.textPrimary.hex,
          }
        ),
        this.scene.add.text(
          250,
          5,
          `SPD: ${this.unitsConfig[key as UnitType].speed}`,
          {
            fontSize: "18px",
            fontStyle: "bold",
            color: colors.textPrimary.hex,
          }
        ),
        this.scene.add
          .rectangle(350, 0, 80, 50, colors.backgroundAccent.number)
          .setOrigin(0),
        this.scene.add
          .text(390, 25, `${count}`, {
            fontSize: "32px",
            fontStyle: "bold",

            color: "#09090d",
          })
          .setOrigin(0.5),
      ]);
      this.panels.add(container);
      i++;
    }
  }
}
