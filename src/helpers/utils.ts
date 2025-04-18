
export function drawTrajectory(
  scene: Phaser.Scene,
  x: number,
  y: number,
  angle: number,
  speed: number,
  gravity: number,
  steps: number = 60
) {
  const g = scene.add.graphics();
  g.clear();
  g.lineStyle(2, 0xffd900, 1);

  const vx = Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;

  const points: Phaser.Math.Vector2[] = [];

  for (let i = 0; i < steps; i++) {
    const t = i / 10;
    const px = x + vx * t;
    const py = y + vy * t + 0.5 * gravity * t * t;
    points.push(new Phaser.Math.Vector2(px, py));
  }

  g.beginPath();
  g.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    g.lineTo(points[i].x, points[i].y);
  }
  g.strokePath();

  scene.time.delayedCall(3000, () => g.destroy(), [], scene);
}
