import { colors } from "@/helpers/config";
import { Scene } from "phaser";

export class Preloader extends Scene {
  constructor() {
    super("Preloader");
  }

  init() {
    this.cameras.main.setBackgroundColor(colors.overlay.number);

    const barWidth = 800;
    const barHeight = 40;
    const barX = this.cameras.main.centerX;
    const barY = this.cameras.main.centerY + 100;

    this.add
      .rectangle(barX, barY, barWidth, barHeight, 0x333333)
      .setStrokeStyle(4, 0x444444);

    const bar = this.add.rectangle(
      barX - (barWidth / 2 - 2),
      barY,
      4,
      barHeight - 4,
      colors.textPrimary.number
    );

    this.tweens.add({
      targets: bar,
      duration: 500,
      ease: "Power2",
      yoyo: true,
      repeat: -1,
      alpha: 0.6,
    });

    this.load.on("progress", (progress: number) => {
      bar.width = (barWidth - 8) * progress;
    });

    this.add
      .text(barX, barY - 150, "LOADING...", {
        font: "30px Arial",
        color: "#FFFFFF",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 4,
        align: "center",
      })
      .setOrigin(0.5);

    const percentText = this.add
      .text(barX, barY + 50, "0%", {
        font: "20px Arial",
        color: "#FFFFFF",
        fontStyle: "bold",
        stroke: "#000000",
        strokeThickness: 2,
        align: "center",
      })
      .setOrigin(0.5);

    this.load.on("progress", (progress: number) => {
      percentText.setText(`${Math.round(progress * 100)}%`);
    });
  }

  preload() {
    this.load.pack("assets_pack", "assets/assets.json");
  }

  create() {
    this.scene.start("MainMenu");
  }
}
