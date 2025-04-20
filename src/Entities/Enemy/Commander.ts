import { Game } from "../../scenes/Game";
import { Unit } from "../Units/Unit";

export class Commander {
  scene: Game;
  units: Unit[] = [];
  events = new Phaser.Events.EventEmitter();

  constructor(scene: Game) {
    this.scene = scene;
    scene.controlPanel.events.on("waveStart", this.spawn, this);
  }

  spawn() {
    for (let i = 0; i < 30; i++) {
      const angle = Phaser.Math.DegToRad((360 / 30) * i);
      const x = 1024 + 800 * Math.cos(angle);
      const y = 1024 + 800 * Math.sin(angle);
      const unit = new Unit(this.scene, x, y, "light");
      this.events.emit("newUnit", unit);
      this.units.push(unit);
      this.scene.units.add(unit);
    }
  }
}
