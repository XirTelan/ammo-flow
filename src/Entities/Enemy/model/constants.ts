import { UnitType } from "@/helpers/types";

export const waveTemplates = [
  {
    name: "Early",
    types: ["light"],
    weights: [1],
    multiplier: 1.0,
    minWave: 1,
  },
  {
    name: "EarlyMid",
    types: ["light", "medium"],
    weights: [3, 1],
    multiplier: 1.0,
    minWave: 3,
  },
  {
    name: "Blitz",
    types: ["light", "air"],
    weights: [3, 2],
    multiplier: 1.0,
    minWave: 5,
  },
  {
    name: "Balanced",
    types: ["light", "medium", "artillery"],
    weights: [2, 2, 1],
    multiplier: 1.0,
    minWave: 15,
  },
  {
    name: "Siege",
    types: ["artillery", "heavy"],
    weights: [3, 1],
    multiplier: 1.1,
    minWave: 15,
  },
  {
    name: "Armored",
    types: ["medium", "heavy"],
    weights: [3, 2],
    multiplier: 1.2,
    minWave: 10,
  },
  {
    name: "AirRaid",
    types: ["air"],
    weights: [1],
    multiplier: 0.9,
    minWave: 5,
  },
] satisfies {
  name: string;
  types: UnitType[];
  weights: number[];
  multiplier: number;
  minWave: number;
}[];

export const spawnTemplates = ["line", "flank", "surround", "corner"];

export const map = {
  width: 2048,
  height: 2048,
};

export const playerBase = {
  x: map.width / 2,
  y: map.height / 2,
};

export const unitCosts = {
  light: 1,
  medium: 3,
  heavy: 5,
  air: 2,
  artillery: 4,
};
