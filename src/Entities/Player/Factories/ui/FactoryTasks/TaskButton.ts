import { Scene } from "phaser";
import { colors } from "../../../../../helpers/config";

export class TaskButton {
  private scene: Scene;
  private offset: number;
  private title: string;
  private lines: boolean;

  container: Phaser.GameObjects.Container;

  constructor(
    scene: Scene,
    offset: number,
    title: string,
    action: () => void,
    lines: boolean = true
  ) {
    this.scene = scene;
    this.offset = offset;
    this.title = title;
    this.lines = lines;

    const container = this.scene.add.container();
    if (this.lines) {
      const graphics = this.scene.add.graphics();
      graphics.lineStyle(5, colors.backgroundAccent.number);
      graphics.lineBetween(10, this.offset - 20, 10, this.offset + 30);
      graphics.lineBetween(8, this.offset + 30, 50, this.offset + 30);
      container.add(graphics);
    }

    const bg = this.scene.add.rectangle(
      100,
      this.offset + 30,
      140,
      30,
      colors.overlay.number
    );
    const border = this.scene.add.rectangle(
      100,
      this.offset + 30,
      150,
      40,
      colors.backgroundAccent.number
    );
    const text = this.scene.add
      .text(100, this.offset + 30, this.title.toLocaleUpperCase(), {
        color: "#fff",
      })
      .setOrigin(0.5);

    container.add([border, bg, text]);
    bg.setInteractive();
    bg.on("pointerout", () => {
      console.log("1");
      bg.fillColor = colors.overlay.number;
      text.setColor("#FFF");
    });
    bg.on("pointerover", () => {
      console.log("1");
      bg.fillColor = colors.backgroundAccent.number;
      text.setColor("#000");
    });
    bg.on("pointerup", () => action());

    this.container = container;
  }
}
