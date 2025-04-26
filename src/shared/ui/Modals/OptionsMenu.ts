import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";
import { colors } from "@/helpers/config";

const BAR_WIDTH = 250;

export class OptionsMenu extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private volumeLabel: Phaser.GameObjects.Text;
  private volumeBarBg: Phaser.GameObjects.Rectangle;
  private volumeBarFill: Phaser.GameObjects.Rectangle;
  private volumeValueText: Phaser.GameObjects.Text;
  private decreaseButton: TaskButton;
  private increaseButton: TaskButton;
  private volume: number = 100;

  private onCloseAction?: () => void;

  constructor(scene: Phaser.Scene, onClose?: () => void) {
    super(scene, 0, 0);
    this.volume = Number(localStorage.getItem("volume")) ?? 100;

    this.onCloseAction = onClose;
    this.scene = scene;

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
    const container = this.scene.add.container(
      width / 2 - 150,
      height / 2 - 200
    );

    const row = this.scene.add.container(-150, 0);

    this.volumeLabel = this.scene.add
      .text(0, 0, "Volume:", {
        fontSize: "24px",
        fontFamily: "Lucida Console, monospace",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);

    const barHeight = 20;

    this.volumeBarBg = this.scene.add
      .rectangle(0, 0, BAR_WIDTH, barHeight, colors.overlay.number)
      .setOrigin(0, 0.5);

    this.volumeBarFill = this.scene.add
      .rectangle(
        0,
        0,
        (this.volume / 100) * BAR_WIDTH,
        barHeight,
        colors.background.number
      )
      .setOrigin(0, 0.5);

    this.volumeValueText = this.scene.add
      .text(0, 0, `${this.volume}%`, {
        fontSize: "20px",
        fontFamily: "Lucida Console, monospace",
        color: "#ffffff",
      })
      .setOrigin(0, 0.5);

    this.decreaseButton = new TaskButton(
      this.scene,
      -30,
      "-",
      () => this.adjustVolume(-5),
      false,
      40
    );

    this.increaseButton = new TaskButton(
      this.scene,
      -30,
      "+",
      () => this.adjustVolume(5),
      false,
      40
    );

    const buttonsRow = this.scene.add.container(0, 0, [
      this.decreaseButton.container,
      this.increaseButton.container,
    ]);
    this.decreaseButton.container.x = 0;
    this.increaseButton.container.x = 50;

    let currentX = 0;

    this.volumeLabel.x = currentX;
    currentX += this.volumeLabel.width + 20;

    this.volumeBarBg.x = currentX;
    this.volumeBarFill.x = currentX;

    currentX += BAR_WIDTH + 10;

    this.volumeValueText.x = currentX;
    currentX += this.volumeValueText.width + 20;

    buttonsRow.x = currentX;

    row.add([
      this.volumeLabel,
      this.volumeBarBg,
      this.volumeBarFill,
      this.volumeValueText,
      buttonsRow,
    ]);

    const backButton = new TaskButton(
      this.scene,
      80,
      "BACK",
      () => this.hide(),
      false,
      250
    );
    backButton.container.x = 0;

    container.add([row, backButton.container]);
    this.add(container);
  }

  private adjustVolume(amount: number): void {
    this.volume = Phaser.Math.Clamp(this.volume + amount, 0, 100);
    this.volumeBarFill.width = (this.volume / 100) * BAR_WIDTH;
    this.volumeValueText.setText(`${this.volume}%`);

    localStorage.setItem("volume", this.volume.toString());
    this.scene.game.sound.setVolume(this.volume / 100);
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    this.onCloseAction?.();
    this.setVisible(false);
  }
}
