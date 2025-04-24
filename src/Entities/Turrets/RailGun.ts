import { Game } from "@/scenes/Game";
import { Turret } from "./Turret";

export class Railgun extends Turret {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "railgun", "default");
  }
}
