import { Scene } from "phaser";

export class BaseButton {
  container: Phaser.GameObjects.Container;
  baseImage: Phaser.GameObjects.Image;
  overImage: Phaser.GameObjects.Image;
  pressed?: Phaser.GameObjects.Image;
  isActive: boolean = false;
  constructor(
    scene: Scene,
    x: number,
    y: number,
    baseTexture: string,
    overTexture: string,
    pressedTexture?: string
  ) {
    this.container = scene.add.container(x, y);
    this.baseImage = scene.add.image(0, 0, baseTexture);
    this.overImage = scene.add.image(0, 0, overTexture);

    this.container.add([this.baseImage, this.overImage]);
    if (pressedTexture) {
      this.pressed = scene.add.image(0, 0, pressedTexture);
      this.container.add(this.pressed);
      this.pressed.setVisible(false);
    }

    this.baseImage.setInteractive();

    this.baseImage.on("pointerdown", this.onPoniterDown, this);
    this.baseImage.on("pointerup", this.onPoniterUp, this);
    this.baseImage.on("pointerover", this.onPoniterEnter, this);
    this.baseImage.on("pointerout", this.onPointerLeave, this);
    this.overImage.setVisible(false);
  }

  onPoniterDown() {
    this.pressed?.setVisible(true);
  }

  onPoniterUp() {
    if (!this.isActive) this.pressed?.setVisible(false);
  }

  onPoniterEnter() {
    this.overImage.setVisible(true);
  }
  onPointerLeave() {
    this.overImage.setVisible(false);
  }

  toggle() {
    this.isActive = !this.isActive;
    if (this.isActive) {
      this.pressed?.setVisible(true);
    } else {
      this.pressed?.setVisible(false);
    }
  }
  setActive(value: boolean) {
    this.isActive = value;
    this.pressed?.setVisible(value);
  }
}
