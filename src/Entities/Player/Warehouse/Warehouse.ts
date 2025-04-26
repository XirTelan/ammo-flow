import { AllAmmoData, TurretType, AmmoVariant } from "../../../helpers/types";

export class Warehouse {
  events = new Phaser.Events.EventEmitter();

  private ammoData: AllAmmoData;

  private inventory: Record<TurretType, Record<string, number>> = {
    machineGun: {},
    plasmaCannon: {},
    flakCannon: {},
    railgun: {},
    artillery: {},
  };

  constructor(ammoData: AllAmmoData) {
    this.ammoData = ammoData;

    for (const turret in ammoData) {
      for (const variant in ammoData[turret as TurretType]) {
        this.inventory[turret as TurretType][variant] = 0;
      }
    }
  }

  addAmmo(turret: TurretType, variant: string, amount: number): void {
    if (!this.inventory[turret][variant]) this.inventory[turret][variant] = 0;
    this.inventory[turret][variant] += amount;
    this.events.emit(`${turret}.${variant}`, this.inventory[turret][variant]);
  }

  consumeAmmo(turret: TurretType, variant: string, amount: number): boolean {
    const current = this.inventory[turret][variant] || 0;
    if (current >= amount) {
      this.inventory[turret][variant] -= amount;
      this.events.emit(`${turret}.${variant}`, this.inventory[turret][variant]);
      return true;
    }
    return false;
  }

  getAmmoCount(turret: TurretType, variant: string): number {
    return this.inventory[turret][variant] || 0;
  }

  getAmmoStats(turret: TurretType, variant: string): AmmoVariant | undefined {
    return this.ammoData[turret]?.[variant];
  }
  getAll() {
    return this.inventory;
  }
}
