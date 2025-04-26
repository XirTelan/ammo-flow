import { Scene } from "phaser";
import { TurretType } from "../../../helpers/types";
import { Warehouse } from "../Warehouse";
import { ControlPanel } from "../ControlPanel/ControlPanel";

export class Factory {
  private warehouse: Warehouse;
  private controlPanel: ControlPanel;
  activeWorkers = 0;
  productionCd = 1;
  productionRate = 1;
  productionPerCycle = 0;
  task?: TurretType | "repair";
  events = new Phaser.Events.EventEmitter();
  ammoType?: string;
  productionConfigs: {
    [key in TurretType]: {
      rate: number;
      scale: number;
    };
  };

  constructor(scene: Scene, controlPanel: ControlPanel) {
    this.warehouse = controlPanel.warehouse;
    this.controlPanel = controlPanel;
    this.productionConfigs = scene.cache.json.get("factories");
  }

  update() {
    if (this.activeWorkers == 0 || !this.task) return;

    this.productionCd -= 0.1;
    this.events.emit("cdTick", this.productionCd / this.productionRate);
    if (this.productionCd > 0) return;

    this.produce();
    this.productionCd = this.productionRate;
  }
  produce() {
    if (!this.task) return;
    if (this.task === "repair") {
      this.controlPanel.health = this.controlPanel.health + this.activeWorkers;
      return;
    }
    if (!this.ammoType) return;

    this.warehouse.addAmmo(
      this.task as TurretType,
      this.ammoType,
      1 * this.productionPerCycle * this.activeWorkers
    );
  }

  addWorker(count: number = 1) {
    const addAmount = Math.min(this.controlPanel.workersAvailable, count);
    if (addAmount === 0) return;

    this.controlPanel.takeWorker(addAmount);
    this.activeWorkers += addAmount;
    this.events.emit("activeWorkerChange", this.activeWorkers);
  }
  removeWorker(count: number = 1) {
    const newVal = this.activeWorkers - count;
    if (newVal < 0) return;

    this.activeWorkers = newVal;
    this.controlPanel.returnWorker(count);

    this.events.emit("activeWorkerChange", this.activeWorkers);
  }

  switchToRepair() {
    this.task = "repair";
    this.productionRate = 10;
    this.productionCd = this.productionRate;
    this.productionPerCycle = 1;

    this.events.emit("taskChanged");
  }

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
