import { Scene } from "phaser";
import { colors } from "../../../../../helpers/config";

export class TaskButton {
  private scene: Scene;

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

    const container = this.scene.add.container();
    const yPos = offset + 30;

    if (showLines) {
      container.add(this.createLineGraphics(offset));
    }

    const border = this.createBorder(yPos, width);
    const bg = this.createBackground(yPos, width, borderThickness);
    const text = this.createText(yPos, title);

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

  private createBorder(
    yPos: number,
    width: number
  ): Phaser.GameObjects.Rectangle {
    return this.scene.add.rectangle(
      100,
      yPos,
      width,
      40,
      colors.backgroundAccent.number
    );
  }

  private createBackground(
    yPos: number,
    width: number,
    borderThickness: number
  ): Phaser.GameObjects.Rectangle {
    return this.scene.add
      .rectangle(
        100,
        yPos,
        width - borderThickness * 2,
        30,
        colors.overlay.number
      )
      .setInteractive();
  }

  private createText(yPos: number, title: string): Phaser.GameObjects.Text {
    return this.scene.add
      .text(100, yPos, title.toUpperCase(), {
        color: "#fff",
        fontStyle: "bold",
        fontSize: "22px",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, colors.accentHighlight.hex, 4, true, true);
  }

  private setupHoverEffect(
    bg: Phaser.GameObjects.Rectangle,
    text: Phaser.GameObjects.Text
  ) {
    bg.on("pointerover", () => {
      this.scene.sound.play("btnUiOver");
      bg.fillColor = colors.backgroundAccent.number;
      text.setColor("#444");
      text.setShadow(0, 0, colors.accentHighlight.hex, 10, true, true);
    });
    bg.on("pointerout", () => {
      bg.fillColor = colors.overlay.number;

      text.setColor("#FFF");
      text.setShadow(0, 0, colors.accentHighlight.hex, 4, true, true);
    });
    bg.on("pointerup", () => {
      this.scene.sound.play("btnUiPress");
    });
  }
}
