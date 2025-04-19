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

  update(_time: number, delta: number) {
    if (this.activeWorkers == 0) return;
    this.productionCd -= (delta / 1000) * this.activeWorkers;
    if (this.productionCd > 0) return;

    this.produce();
    this.productionCd = this.productionRate;
  }
  produce() {
    this.warehouse.addAmmo(this.turretType, this.ammoType, 1);
  }
}
