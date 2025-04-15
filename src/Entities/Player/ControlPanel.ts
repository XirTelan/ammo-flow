import { Scene } from "phaser";
import { Warehouse } from "./Warehouse";
import { TurretType } from "../../helpers/types";

export class ControlPanel {
  scene: Scene;
  warehouse: Warehouse;

  text: Phaser.GameObjects.Text;
  constructor(scene: Scene) {
    this.warehouse = Warehouse.getInstance();
    this.text = scene.add.text(300, 700, "Ammo: 0", { fontSize: "16px" });
    this.warehouse.subscribe(`artillery.default`, (value) => {
      this.text.text = value;
    });
  }

  registerTurretType(turret: TurretType) {}
  unregisterTurretType(turret: TurretType) {}
}
