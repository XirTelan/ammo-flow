import { Scene, GameObjects } from "phaser";
import { colors } from "@/helpers/config";

export class Effects {
  static addPulseEffect(scene: Scene, target: GameObjects.Text, speed = 1000) {
    scene.tweens.add({
      targets: target,
      alpha: { from: 1, to: 0.5 },
      yoyo: true,
      repeat: -1,
      duration: speed,
      ease: "Sine.inOut",
    });
  }

  static addScrollingText(
    scene: Scene,
    text: string,
    y: number,
    speed = 10000
  ): GameObjects.Text {
    const scrollText = scene.add.text(-300, y, text, {
      fontSize: "18px",
      fontFamily: "Lucida Console, monospace",
      color: colors.textSecondary.hex,
    });

    scene.tweens.add({
      targets: scrollText,
      x: scene.scale.width + 300,
      duration: speed,
      repeat: -1,
      ease: "Linear",
    });

    return scrollText;
  }

  static addScanlineOverlay(
    scene: Scene,
    config?: {
      height?: number;
      width?: number;
      posX?: number;
      posY?: number;
      alpha?: number;
    }
  ): GameObjects.Graphics {
    const graphics = scene.add.graphics();
    const camera = scene.cameras.main;

    const width = config?.width ?? camera.width;
    const height = config?.height ?? camera.height;
    const posX = config?.posX ?? 0;
    const posY = config?.posY ?? 0;
    const lineSpacing = height * 0.005;
    const alpha = config?.alpha ?? 0.05;

    graphics.fillStyle(0x000000, alpha);

    for (let y = posY; y < height + posY; y += lineSpacing) {
      graphics.fillRect(posX, y, width, 1);
    }

    graphics.setScrollFactor(0);
    graphics.setDepth(100);
    return graphics;
  }

  static createPulseShimmer(
    scene: Scene,
    width: number,
    height: number,
    duration: number = 5,
    container?: Phaser.GameObjects.Container
  ) {
    const shimmer = scene.add.rectangle(0, 0, width, 30, 0xffffff, 0.03);
    shimmer.setOrigin(0);
    if (container) container.add(shimmer);

    scene.tweens.add({
      targets: shimmer,
      y: height,
      duration: duration * 1000,
      repeat: -1,
      ease: "Sine.inOut",
    });
  }

  static addShimmerEffect(
    scene: Scene,
    target: GameObjects.Text | GameObjects.Image,
    delay = 0
  ) {
    scene.tweens.add({
      targets: target,
      alpha: { from: 0.7, to: 1 },
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: "Sine.inOut",
      delay,
    });
  }

  static flickerText(
    scene: Scene,
    target: GameObjects.Text,
    times = 4,
    delay = 100
  ) {
    const originalAlpha = target.alpha;
    let count = 0;

    scene.time.addEvent({
      delay,
      repeat: times * 2,
      callback: () => {
        target.alpha = target.alpha === 0 ? originalAlpha : 0;
        count++;
      },
    });
  }

  static createVerticalDataStream(scene: Scene, count = 5) {
    const streams: Phaser.GameObjects.Graphics[] = [];
    const width = scene.scale.width;
    const height = scene.scale.height;

    const streamColors = [
      { color: colors.border.number, alpha: 0.5 },
      { color: colors.textSecondary.number, alpha: 0.3 },
      { color: colors.accentHighlight.number, alpha: 0.4 },
    ];

    for (let i = 0; i < count; i++) {
      const picked = Phaser.Utils.Array.GetRandom(streamColors);
      const x = Math.random() * width;
      const line = scene.add.graphics();
      line.lineStyle(1, picked.color, picked.alpha);
      line.beginPath();
      line.moveTo(x, 0);
      line.lineTo(x, height);
      line.strokePath();
      line.setAlpha(picked.alpha);

      streams.push(line);

      scene.tweens.add({
        targets: line,
        x: `+=${Phaser.Math.Between(-20, 20)}`,
        duration: Phaser.Math.Between(4000, 8000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });

      scene.tweens.add({
        targets: line,
        alpha: { from: picked.alpha, to: picked.alpha * 0.7 },
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: "Sine.easeInOut",
      });
    }

    return streams;
  }
}
