import { BaseButton } from "@/shared/ui/BaseButton";
import { Game } from "@/scenes/Game";

export class TimeControl {
  private buttons: BaseButton[] = [];

  constructor(
    private scene: Phaser.Scene,
    private gameScene: Game,
    private buttonPositions = { x: 1498, y: 26, spacing: 42 }
  ) {}

  init() {
    const { x, y, spacing } = this.buttonPositions;

    const stopBtn = new BaseButton(
      this.scene,
      x + spacing * 0,
      y,
      "pause_normal",
      "pause_over",
      "pause_pressed"
    );
    const slowBtn = new BaseButton(
      this.scene,
      x + spacing * 1,
      y,
      "speed_slow",
      "speed_slow_over",
      "speed_slow_pressed"
    );
    const normalBtn = new BaseButton(
      this.scene,
      x + spacing * 2 + 2,
      y,
      "speed_normal",
      "speed_normal_over",
      "speed_normal_pressed"
    );
    const fastBtn = new BaseButton(
      this.scene,
      x + spacing * 3 + 5,
      y,
      "speed_fast",
      "speed_fast_over",
      "speed_fast_pressed"
    );

    normalBtn.toggle();

    this.gameScene.events.on("pause", (value: boolean) => {
      stopBtn.setActive(value);
    });

    stopBtn.baseImage.on("pointerup", () => {
      this.gameScene.togglePause();
    });

    slowBtn.baseImage.on("pointerup", () => {
      this.changeTime(slowBtn, 2, 0.5);
    });

    normalBtn.baseImage.on("pointerup", () => {
      this.changeTime(normalBtn, 1, 1);
    });

    fastBtn.baseImage.on("pointerup", () => {
      this.changeTime(fastBtn, 0.5, 2);
    });

    this.buttons.push(stopBtn, slowBtn, normalBtn, fastBtn);
  }

  changeTime(btn: BaseButton, physScale: number, timeScale: number) {
    this.gameScene.setTimeScale(physScale, timeScale);
    this.disableAll();
    btn.toggle();
  }

  disableAll() {
    this.buttons.forEach((btn) => btn.setActive(false));
  }
}
