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

    stopBtn.baseImage.on("pointerup", () => {
      if (this.gameScene.scene.isPaused()) {
        this.gameScene.scene.resume();
      } else {
        this.gameScene.scene.pause();
      }
      stopBtn.toggle();
    });

    slowBtn.baseImage.on("pointerup", () => {
      this.setTimeScale(slowBtn, 2, 0.5);
    });

    normalBtn.baseImage.on("pointerup", () => {
      this.setTimeScale(normalBtn, 1, 1);
    });

    fastBtn.baseImage.on("pointerup", () => {
      this.setTimeScale(fastBtn, 0.5, 2);
    });

    this.buttons.push(stopBtn, slowBtn, normalBtn, fastBtn);
  }

  private setTimeScale(
    activeBtn: BaseButton,
    physScale: number,
    timeScale: number
  ) {
    if (this.gameScene.scene.isPaused()) {
      this.gameScene.scene.resume();
    }
    this.gameScene.physics.world.timeScale = physScale;
    this.gameScene.time.timeScale = timeScale;

    this.disableAll();
    activeBtn.toggle();
  }

  disableAll() {
    this.buttons.forEach((btn) => btn.setActive(false));
  }
}
