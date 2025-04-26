import { Scene } from "phaser";
import { Commander } from "../Commander";
import { colors } from "../../../helpers/config";
import { NextWave, UnitsData, UnitType } from "../../../helpers/types";

export class EnemiesIntel {
  commander: Commander;
  scene: Scene;
  panels: Phaser.GameObjects.Container;
  totalCount: Phaser.GameObjects.Text;
  unitsConfig: UnitsData;

  constructor(scene: Scene, commander: Commander) {
    this.scene = scene;
    this.commander = commander;
    this.unitsConfig = scene.cache.json.get("units");

    this.commander.events.on("nextWave", this.showInfo, this);
    this.createStaticUI();
    this.showInfo(this.commander.nextWave);
  }

  private createStaticUI() {
    const labelStyle = {
      color: "#444",
      fontSize: "24px",
      fontStyle: "bold",
    };

    this.scene.add.rectangle(1475, 80, 450, 40, 0xdfd6c5).setOrigin(0);
    const nextWaveLabel = this.scene.add.text(
      1495,
      85,
      "NEXT WAVE INTEL | COUNT:",
      labelStyle
    );

    this.totalCount = this.scene.add.text(
      nextWaveLabel.x + nextWaveLabel.width + 10,
      nextWaveLabel.y,
      "",
      labelStyle
    );

    this.scene.add
      .rectangle(1480, 120, 430, 200, colors.overlay.number)
      .setOrigin(0);
  }

  private createUnitText(
    x: number,
    y: number,
    content: string,
    customColor?: string
  ): Phaser.GameObjects.Text {
    return this.scene.add.text(x, y, content, {
      fontSize: "18px",
      fontStyle: "bold",
      color: customColor ?? colors.textPrimary.hex,
    });
  }

  showInfo(wave: NextWave) {
    this.panels?.destroy();
    this.panels = this.scene.add.container(1485, 120);

    const stats = [
      { key: "hp", label: "HP" },
      { key: "fireRange", label: "RNG" },
      { key: "damage", label: "DMG" },
      { key: "armor", label: "ARM" },
      { key: "speed", label: "SPD" },
      {
        key: "type",
        label: "TYPE",
        transform: (val: any) => val.toUpperCase(),
      },
    ];

    let total = 0;
    let i = 0;

    for (const [key, count] of Object.entries(wave.units)) {
      if (count === 0) continue;
      total += count;

      const unit = this.unitsConfig[key as UnitType];
      const container = this.scene.add.container(0, i * 55);

      const statElements: Phaser.GameObjects.GameObject[] = stats.map(
        (stat, index) => {
          const col = index % 3;
          const row = Math.floor(index / 3);
          const x = 40 + col * 100;
          const y = 5 + row * 20;

          const value = unit[stat.key as keyof typeof unit];
          const display = stat.transform ? stat.transform(value) : value;

          return this.createUnitText(x, y, `${stat.label}: ${display}`);
        }
      );

      const columnSeparators = [1, 2].map((colIndex) => {
        const x = 40 + colIndex * 100 - 10;
        return this.scene.add
          .rectangle(x, 5, 2, 40, colors.textPrimary.number)
          .setOrigin(0);
      });

      container.add([
        this.scene.add
          .rectangle(0, 0, 400, 50, colors.overlay.number)
          .setOrigin(0),
        this.scene.add.image(10, 10, `u_${key}`).setOrigin(0).setScale(0.4),
        ...statElements,
        ...columnSeparators,

        this.scene.add
          .text(395, 25, `${count}`, {
            fontSize: "28px",
            fontStyle: "bold",
            color: colors.textPrimary.hex,
          })
          .setOrigin(0.5),
        this.scene.add.rectangle(225, 50, 250, 2, colors.textPrimary.number),
      ]);

      this.panels.add(container);

      //animation sectior
      container.setAlpha(0).setScale(0.95);
      this.scene.tweens.add({
        targets: container,
        alpha: 1,
        scale: 1,
        ease: "Power1",
        duration: 300,
        delay: i * 100,
      });

      const scanLine = this.scene.add
        .rectangle(0, 0, 430, 2, 0xffffff)
        .setOrigin(0)
        .setAlpha(0.4);
      container.add(scanLine);

      this.scene.tweens.add({
        targets: scanLine,
        y: 48,
        ease: "Sine.easeInOut",
        duration: 300,
        delay: i * 100,
        onComplete: () => scanLine.destroy(),
      });

      i++;
    }

    this.totalCount.setText(total.toString());
  }
}
