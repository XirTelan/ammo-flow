import { Game } from "@/scenes/Game";
import { Turret } from "./Turret";
import { Warehouse } from "../Player/Warehouse";

export class Railgun extends Turret {
  constructor(scene: Game, warehouse: Warehouse, x: number, y: number) {
    super(scene, warehouse, x, y, "railgun", "default");
  }
}
