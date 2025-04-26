import { Scene } from "phaser";
import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";
import { PauseOption } from "@/helpers/types";
import { colors } from "@/helpers/config";
import { Effects } from "@/shared/Effects";

export class GameOver extends Scene {
  private options: PauseOption[];

  constructor() {
    super("GameOver");
    this.options = [
      { title: "Restart", action: () => this.restartGame() },
      { title: "Exit to Main Menu", action: () => this.exitToMainMenu() },
    ];
  }

  create() {
    const width = this.scale.width;
    const height = this.scale.height;

    const background = this.add
      .rectangle(0, 0, width, height, colors.overlay.number, 1)
      .setOrigin(0)
      .setInteractive();

    const gameOverText = this.add
      .text(width / 2, height / 2 - 160, "MISSION FAILED", {
        fontSize: "48px",
        fontFamily: "Lucida Console, monospace",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5);

    const listWidth = 200;
    const listHeight = this.options.length * 45 + 45;
    const centerX = (width - listWidth) / 2;
    const centerY = (height - listHeight) / 2;

    const gameOverList = this.add.container(centerX, centerY);
    let offsetY = 0;

    this.options.forEach((option) => {
      const btn = new TaskButton(
        this,
        offsetY,
        option.title,
        option.action,
        false,
        250
      );

      gameOverList.add(btn.container);
      offsetY += 45;
    });

    this.add.existing(gameOverList);
    this.add.existing(gameOverText);
    this.add.existing(background);

    Effects.addScanlineOverlay(this, {
      height,
      width,
      posX: 0,
      posY: 0,
    });
    Effects.createVerticalDataStream(this, 8);
    Effects.createPulseShimmer(this, width, height, 10);
  }

  private restartGame(): void {
    this.scene.start("Game");
  }

  private exitToMainMenu(): void {
    this.scene.stop("Game");
    this.scene.start("MainMenu");
  }
}
