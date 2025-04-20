export type DamageType =
  | "kinetic"
  | "fire"
  | "explosive"
  | "electric"
  | "energy";
export type Warehouse = {};

export type TurretType =
  | "machineGun"
  | "sniper"
  | "plasmaCannon"
  | "flakCannon"
  | "railgun"
  | "artillery";

export type FactoriesConfig = {
  [key in TurretType]: FactoryStats;
};

export type FactoryStats = {
  productionRate: number;
};

export type AmmoType = {
  [variant: string]: AmmoVariant;
};

export type AllAmmoData = {
  [key in TurretType]: AmmoType;
};

export interface AmmoVariant {
  speed: number;
  damage: number;
  damageType: DamageType;
  statusEffect?: string;
  rangeMod: number;
  armorPenetration?: number;
  splashRadius?: number;
  tracking?: boolean;
}

export type TurretConfig = {
  range: number;
  fireRate: number;
  ammoSizeLoad: number;
  ammoMaxLoad: number;
};
