import { Scene, GameObjects } from "phaser";
import { AudioManager } from "@/entities/general/AudioManager";
import { colors } from "@/helpers/config";

type TaskButtonConfig = {
  scene: Scene;
  x?: number;
  y?: number;
  width: number;
  height: number;
  title: string;
  action: () => void;
  borderThickness?: number;
  showLines?: boolean;
};

export class TaskButton {
  private scene: Scene;
  container: GameObjects.Container;
  btn: GameObjects.Rectangle;

  constructor({
    scene,
    x = 0,
    y = 0,
    width,
    height,
    title,
    action,
    borderThickness = 5,
  }: TaskButtonConfig) {
    this.scene = scene;
    this.container = scene.add.container(x, y);

    const border = this.createBorderBg(0, 0, width, height);
    const bg = this.createBackground(0, 0, width, height, borderThickness);
    const text = this.createText(0, 0, title);

    this.setupHoverEffect(bg, text, action);

    this.container.add([border, bg, text]);
    this.btn = bg;
  }

  private createBorderBg(
    x: number,
    y: number,
    width: number,
    height: number
  ): GameObjects.Rectangle {
    return this.scene.add.rectangle(
      x,
      y,
      width,
      height,
      colors.backgroundAccent.number
    );
  }

  private createBackground(
    x: number,
    y: number,
    width: number,
    height: number,
    border: number
  ): GameObjects.Rectangle {
    return this.scene.add
      .rectangle(
        x,
        y,
        width - border * 2,
        height - border * 2,
        colors.overlay.number
      )
      .setInteractive({ useHandCursor: true });
  }

  private createText(x: number, y: number, title: string): GameObjects.Text {
    return this.scene.add
      .text(x, y, title.toUpperCase(), {
        fontSize: "22px",
        fontStyle: "bold",
        color: "#ffffff",
      })
      .setOrigin(0.5)
      .setShadow(0, 0, colors.accentHighlight.hex, 4, true, true);
  }

  private setupHoverEffect(
    bg: GameObjects.Rectangle,
    text: GameObjects.Text,
    onClick: () => void
  ) {
    const setHoverStyle = (hovered: boolean) => {
      bg.fillColor = hovered
        ? colors.backgroundAccent.number
        : colors.overlay.number;
      text.setColor(hovered ? "#444" : "#FFF");
      text.setShadow(
        0,
        0,
        colors.accentHighlight.hex,
        hovered ? 10 : 4,
        true,
        true
      );
    };

    bg.on("pointerover", () => {
      this.playSound("btnUiOver");
      setHoverStyle(true);
    });

    bg.on("pointerout", () => {
      setHoverStyle(false);
    });

    bg.on("pointerup", () => {
      this.playSound("btnUiPress");
      onClick();
    });
  }

  private playSound(key: string) {
    AudioManager.getInstance().playSFX(this.scene, key);
  }

  destroy() {
    this.container?.destroy(true);
  }
}
