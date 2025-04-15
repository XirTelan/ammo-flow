import { Game } from "../../scenes/Game";
import { Turret } from "./Turret";

export class Artillery extends Turret {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "artillery", "default");
    this.fireRate = 1;
  }
}
