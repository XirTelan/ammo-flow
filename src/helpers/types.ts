export type DamageType =
  | "kinetic"
  | "fire"
  | "explosive"
  | "electric"
  | "energy";
export type Warehouse = {};

export type UnitType = "light" | "medium" | "heavy" | "air" | "artillery";
export type UnitCount = {
  [key in UnitType]: number;
};
export type UnitConfig = {
  [key in UnitType]: Unit;
};

export type Unit = {
  hp: number;
  speed: number;
  damage: number;
  range: number;
  armor: number;
};

export type TurretType =
  | "machineGun"
  | "plasmaCannon"
  | "flakCannon"
  | "railgun"
  | "artillery";

export type TurretConfig = {
  range: number;
  fireRate: number;
  ammoSizeLoad: number;
  ammoMaxLoad: number;
  spread: number;
};

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
  statusEffect?: string;
  rangeMod: number;
  armorPenetration?: number;
  splashRadius?: number;
  tracking?: boolean;
}

export type NextWave = {
  units: UnitCount;
  positions: { x: number; y: number }[];
};
