import { Game } from "../../scenes/Game";
import { Warehouse } from "../Player/Warehouse";
import { Turret } from "./Turret";

export class MachineGun extends Turret {
  constructor(scene: Game, warehouse: Warehouse, x: number, y: number) {
    super(scene, warehouse, x, y, "machineGun", "default");
  }
}
