import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";
import { ModalContainer } from "@/shared/ui/Modals/Modal";

interface PauseOption {
  title: string;
  action: () => void;
}

export class PauseMenu extends ModalContainer {
  private pauseOptions: PauseOption[];
  private contentText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, onClose?: () => void) {
    super(scene, 0, 0, onClose);

    this.pauseOptions = [
      { title: "Restart", action: () => this.restartGame() },
      { title: "Exit to Main Menu", action: () => this.exitToMainMenu() },
    ];

    const width = scene.scale.width;
    const height = scene.scale.height;

    this.createUI(width, height);
  }

  private createUI(width: number, height: number): void {
    const listWidth = 200;
    const centerX = width / 2;
    const centerY = height / 2;

    const pauseList = this.scene.add.container(centerX, centerY);
    let offsetY = 0;
    this.pauseOptions.forEach((option) => {
      const btn = new TaskButton({
        scene: this.scene,
        y: offsetY,
        title: option.title,
        action: option.action,
        width: 250,
        height: 50,
      });

      pauseList.add(btn.container);
      offsetY += 60;
    });

    const closeBtn = new TaskButton({
      scene: this.scene,
      y: offsetY * 2,
      title: "CLOSE",
      action: () => this.hide(),
      width: 100,
      height: 50,
    });
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
