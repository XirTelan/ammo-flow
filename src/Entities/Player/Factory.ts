import { Scene } from "phaser";
import { Warehouse } from "./Warehouse";
import { TurretType } from "../../helpers/types";

export class Factory {
  warehouse: Warehouse;
  activeWorkers = 0;
  productionCd = 1;
  productionRate = 1;
  turretType: TurretType;
  ammoType: string;

  constructor(scene: Scene, turretType: TurretType, ammoType: string) {
    this.warehouse = Warehouse.getInstance();
    this.turretType = turretType;
    this.ammoType = ammoType;
  }

  update(time: number, delta: number) {
    this.productionCd -= delta / 1000;
    if (this.productionCd > 0) return;

    this.produce();
    this.productionCd = this.productionRate;
  }
  produce() {
    this.warehouse.addAmmo(this.turretType, this.ammoType, 10);
    this.warehouse.addAmmo("machineGun", this.ammoType, 10);
  }
}
