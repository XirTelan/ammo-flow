import { Game } from "@/scenes/Game";
import { Turret } from "./Turret";

export class FlakCannon extends Turret {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "flakCannon", "default");
  }
}
