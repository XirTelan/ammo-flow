import { AllAmmoData, AmmoVariant, TurretType } from "../../helpers/types";

type AmmoListener = (amount: number) => void;

export class Warehouse {
  private static instance: Warehouse;

  private listeners: Map<string, AmmoListener[]>;

  ammoData: AllAmmoData;

  private inventory: Record<TurretType, Record<string, number>> = {
    machineGun: {},
    sniper: {},
    plasmaCannon: {},
    flakCannon: {},
    railgun: {},
    artillery: {},
  };

  static getInstance(): Warehouse {
    if (!Warehouse.instance) {
      Warehouse.instance = new Warehouse();
    }
    return Warehouse.instance;
  }
  subscribe(key: string, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key)?.push(callback);
  }

  init(ammoData: AllAmmoData) {
    this.listeners = new Map();
    this.ammoData = ammoData;

    for (const turret in ammoData) {
      console.log("turret", turret);
      for (const variant in ammoData[turret as TurretType]) {
        this.inventory[turret as TurretType][variant] = 0;
      }
    }
  }
  private notify(key: string, value: number) {
    const listeners = this.listeners.get(key);
    listeners?.forEach((callback) => callback(value));
  }

  addAmmo(turret: TurretType, variant: string, amount: number): void {
    if (!this.inventory[turret][variant]) this.inventory[turret][variant] = 0;
    this.inventory[turret][variant] += amount;
    this.notify(`${turret}.${variant}`, this.inventory[turret][variant]);
  }

  consumeAmmo(turret: TurretType, variant: string, amount: number): boolean {
    const current = this.inventory[turret][variant] || 0;
    if (current >= amount) {
      this.inventory[turret][variant] -= amount;
      this.notify(`${turret}.${variant}`, this.inventory[turret][variant]);
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
}
