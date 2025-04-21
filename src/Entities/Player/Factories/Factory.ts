import { Scene } from "phaser";
import { TurretType } from "../../../helpers/types";
import { Warehouse } from "../Warehouse";

export class Factory {
  warehouse: Warehouse;
  activeWorkers = 0;
  productionCd = 1;
  productionRate = 1;
  task?: TurretType | "repair";
  ammoType?: string;
  productionConfigs: {
    [key in TurretType]: {
      rate: number;
      scale: number;
    };
  };

  constructor(scene: Scene) {
    this.warehouse = Warehouse.getInstance();
    this.productionConfigs = scene.cache.json.get("factories");
    console.log(this.productionConfigs);
  }

  update(_time: number, delta: number) {
    if (this.activeWorkers == 0) return;
    this.productionCd -= delta / 1000;
    if (this.productionCd > 0) return;

    this.produce();
    this.productionCd = this.productionRate;
  }
  produce() {
    if (!this.task) return;
    if (this.task === "repair") {
    }
    if (!this.ammoType) return;

    this.warehouse.addAmmo(this.task as TurretType, this.ammoType, 1);
  }

  switchToRepair() {}

  setAmmo(turret: TurretType, variant: string) {
    if (this.task === turret && this.ammoType == variant) return;

    this.productionRate = this.productionConfigs[turret].rate;
    this.productionCd = this.productionRate;
  }
}
