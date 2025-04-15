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

export type AmmoType = {
  [variant: string]: AmmoVariant;
};

export type AllAmmoData = {
  [T in TurretType]: AmmoType;
};

export interface AmmoVariant {
  speed: number;
  damage: number;
  damageType: DamageType;
  statusEffect?: string;
  armorPenetration?: number;
  splashRadius?: number;
  tracking?: boolean;
}
