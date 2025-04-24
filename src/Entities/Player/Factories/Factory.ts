import { Scale, Scene } from "phaser";
import { TurretType } from "../../../helpers/types";
import { Warehouse } from "../Warehouse";

export class Factory {
  warehouse: Warehouse;
  activeWorkers = 1;
  productionCd = 1;
  productionRate = 1;
  productionPerCycle = 1;
  task?: TurretType | "repair";
  events = new Phaser.Events.EventEmitter();
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

  update() {
    if (this.activeWorkers == 0 || !this.task) return;

    this.productionCd -= 0.1;
    if (this.productionCd > 0) return;

    this.produce();
    this.productionCd = this.productionRate;
  }
  produce() {
    if (!this.task) return;
    if (this.task === "repair") {
    }
    if (!this.ammoType) return;

    this.warehouse.addAmmo(
      this.task as TurretType,
      this.ammoType,
      1 * this.productionPerCycle * this.activeWorkers
    );
  }

  switchToRepair() {}

  setAmmoProduction(turret: TurretType, variant: string) {
    if (this.task === turret && this.ammoType == variant) return;
    this.task = turret;
    this.ammoType = variant;
    this.productionRate = this.productionConfigs[turret].rate;
    this.productionPerCycle = this.productionConfigs[turret].scale;
    this.productionCd = this.productionRate;
    this.events.emit("taskChanged");
  }
}
