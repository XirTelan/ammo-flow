import { Scene } from "phaser";

export class ModalContainer extends Phaser.GameObjects.Container {
  protected background: Phaser.GameObjects.Rectangle;

  protected onCloseAction?: () => void;

  constructor(scene: Scene, x = 0, y = 0, onClose?: () => void) {
    super(scene, x, y);
    this.onCloseAction = onClose;

    const width = scene.scale.width;
    const height = scene.scale.height;

    this.setSize(width, height);

    this.background = scene.add
      .rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setInteractive();

    this.add(this.background);
    this.setDepth(20);
    this.setVisible(false);
    scene.add.existing(this);
  }
  public show() {
    this.setVisible(true);
  }

  public hide() {
    this.onCloseAction?.();
    this.setVisible(false);
  }
}
