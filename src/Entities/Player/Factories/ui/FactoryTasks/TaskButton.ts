import { Scene } from "phaser";
import { colors } from "../../../../../helpers/config";

export class TaskButton {
  private scene: Scene;
  private showLines: boolean;

  container: Phaser.GameObjects.Container;
  btn: Phaser.GameObjects.GameObject;

  constructor(
    scene: Scene,
    offset: number,
    title: string,
    action: () => void,
    showLines: boolean = true,
    width: number = 150,
    borderThickness: number = 5
  ) {
    this.scene = scene;

    this.showLines = showLines;

    const container = this.scene.add.container();
    const yPos = offset + 30;

    if (this.showLines) {
      container.add(this.createLineGraphics(offset));
    }

    const border = this.scene.add.rectangle(
      100,
      yPos,
      width,
      40,
      colors.backgroundAccent.number
    );

    const bg = this.scene.add
      .rectangle(
        100,
        yPos,
        width - borderThickness * 2,
        30,
        colors.overlay.number
      )
      .setInteractive();

    const text = this.scene.add
      .text(100, yPos, title.toUpperCase(), {
        color: "#fff",
        fontStyle: "bold",
        fontSize: "22px",
      })
      .setOrigin(0.5);

    this.setupHoverEffect(bg, text);
    bg.on("pointerup", action);

    container.add([border, bg, text]);

    this.container = container;
    this.btn = bg;
  }

  private createLineGraphics(offset: number): Phaser.GameObjects.Graphics {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(5, colors.backgroundAccent.number);
    graphics.lineBetween(10, offset - 20, 10, offset + 30);
    graphics.lineBetween(8, offset + 30, 50, offset + 30);
    return graphics;
  }

  private setupHoverEffect(
    bg: Phaser.GameObjects.Rectangle,
    text: Phaser.GameObjects.Text
  ) {
    bg.on("pointerover", () => {
      bg.fillColor = colors.backgroundAccent.number;
      text.setColor("#444");
    });
    bg.on("pointerout", () => {
      bg.fillColor = colors.overlay.number;
      text.setColor("#FFF");
    });
  }
}
