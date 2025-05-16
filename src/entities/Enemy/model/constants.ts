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
  airHeavy: 5,
};
