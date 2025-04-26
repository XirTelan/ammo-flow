import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";

interface PauseOption {
  title: string;
  action: () => void;
}

export class PauseMenu extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private pauseOptions: PauseOption[];
  private contentText: Phaser.GameObjects.Text;

  //[TODO: need common modal class]
  private onCloseAction?: () => void;

  constructor(scene: Phaser.Scene, onClose?: () => void) {
    super(scene, 0, 0);

    this.onCloseAction = onClose;

    this.scene = scene;
    this.pauseOptions = [
      { title: "Restart", action: () => this.restartGame() },
      { title: "Exit to Main Menu", action: () => this.exitToMainMenu() },
    ];

    const width = scene.scale.width;
    const height = scene.scale.height;

    this.setSize(width, height);
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    this.background = scene.add
      .rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setInteractive();

    this.add(this.background);

    this.createUI(width, height);
    this.setDepth(20);
    this.setVisible(false);
    scene.add.existing(this);
  }

  private createUI(width: number, height: number): void {
    const listWidth = 200;
    const listHeight = this.pauseOptions.length * 45 + 45;
    const centerX = (width - listWidth) / 2;
    const centerY = (height - listHeight) / 2;

    const pauseList = this.scene.add.container(centerX, centerY);
    let offsetY = 0;
    this.pauseOptions.forEach((option) => {
      const btn = new TaskButton(
        this.scene,
        offsetY,
        option.title,
        option.action,
        false,
        250
      );

      pauseList.add(btn.container);
      offsetY += 45;
    });

    const closeBtn = new TaskButton(
      this.scene,
      offsetY * 2,
      "CLOSE",
      () => this.hide(),
      false
    );
    pauseList.add(closeBtn.container);

    this.contentText = this.scene.add.text(
      centerX + listWidth + 40,
      centerY,
      "",
      {
        fontSize: "28px",
        fontFamily: "Lucida Console, monospace",
        color: "#ffffff",
        wordWrap: { width: width - (centerX + listWidth + 80) },
      }
    );

    this.add([pauseList, this.contentText]);
  }

  private restartGame(): void {
    this.scene.game.scene.stop("Game");
    this.scene.scene.start("Game");
  }

  private exitToMainMenu(): void {
    this.scene.game.scene.stop("Game");
    this.scene.scene.start("MainMenu");
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    this.onCloseAction?.();
    this.setVisible(false);
  }
}
