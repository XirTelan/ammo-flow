export type DamageType =
  | "kinetic"
  | "fire"
  | "explosive"
  | "electric"
  | "energy";
export type Warehouse = {};

export type UnitType =
  | "light"
  | "medium"
  | "heavy"
  | "air"
  | "airHeavy"
  | "artillery";
export type UnitCount = {
  [key in UnitType]: number;
};
export type UnitsData = {
  [key in UnitType]: UnitConfig;
};

export type UnitConfig = {
  hp: number;
  speed: number;
  damage: number;
  fireRange: number;
  fireRate: number;
  type: "air" | "ground";
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

export enum TurretStatus {
  "firing",
  "idle",
  "empty",
}

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
  ap?: number;
  splashRadius?: number;
  type: string;
  tracking?: boolean;
}

export type PauseOption = {
  title: string;
  action: () => void;
};

export type NextWave = {
  units: UnitCount;
  positions: { x: number; y: number }[];
};
