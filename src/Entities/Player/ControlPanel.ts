import { Scene } from "phaser";
import { Warehouse } from "./Warehouse";
import { Turret } from "../Towers/Turret";
import { Factory } from "./Factory";
import { Artillery } from "../Towers/Artillery";
import { MachineGun } from "../Towers/MachineGun";
import { Game } from "../../scenes/Game";
import { AllAmmoData } from "../../helpers/types";

export class ControlPanel {
  scene: Scene;
  warehouse: Warehouse = Warehouse.getInstance();
  turrets: Turret[] = [];
  factories: Factory[] = [];

  text: Phaser.GameObjects.Text;
  constructor(scene: Game) {
    const { ammo }: { ammo: AllAmmoData } = scene.cache.json.get("ammo");
    Warehouse.getInstance().initiateState(ammo);

    this.text = scene.add.text(90, 650, "Ammo: 0", {
      fontSize: "16px",
    });

    this.warehouse.subscribe(`artillery.default`, (value) => {
      this.text.text = value;
    });

    this.factories.push(new Factory(scene, "artillery", "default"));

    this.turrets.push(new Artillery(scene, 1035, 850));
    this.turrets.push(new Artillery(scene, 830, 1020));
    this.turrets.push(new Artillery(scene, 1220, 1120));
    this.turrets.push(new MachineGun(scene, 991, 1200));
  }
  update(time: number, delta: number) {
    if (this.factories.length > 0)
      this.factories.forEach((factory) => factory.update(time, delta));
  }
}
