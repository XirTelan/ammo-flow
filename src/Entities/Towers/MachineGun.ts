import { Game } from "../../scenes/Game";
import { Turret } from "./Turret";

export class MachineGun extends Turret {
  constructor(scene: Game, x: number, y: number) {
    super(scene, x, y, "machineGun", "default");
  }
}
