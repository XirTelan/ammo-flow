import { NextWave, UnitCount, UnitsData, UnitType } from "@/helpers/types";
import { Game } from "@/scenes/Game";
import { Unit } from "@/entities/Units/Unit";
import { map, playerBase, spawnTemplates, unitCosts } from "./model";

type WaveTemplate = {
  name: string;
  types: UnitType[];
  weights: number[];
  multiplier: number;
  minWave: number;
};

export class Commander {
  scene: Game;
  events = new Phaser.Events.EventEmitter();
  nextWave: NextWave;
  waveTemplates: WaveTemplate[];

  constructor(scene: Game) {
    this.scene = scene;
    this.waveTemplates = scene.cache.json.get("waveTemplates");
    this.generateNextWave();
    this.events.emit("nextWave", this.nextWave);
    scene.controlPanel.events.on(
      "waveStart",
      (wave: number) => {
        this.spawn();
        this.generateNextWave(wave);
        this.events.emit("nextWave", this.nextWave);
      },
      this
    );
  }

  generateWave(waveNumber: number) {
    const basePoints = 10;
    const points = basePoints + waveNumber * 3;
    const validTemplates = this.waveTemplates.filter((t) => waveNumber >= t.minWave);
    const template =
      validTemplates[Math.floor(Math.random() * validTemplates.length)];
    let wavePoints = Math.floor(points * template.multiplier);

    const wave: UnitCount = {
      light: 0,
      air: 0,
      artillery: 0,
      heavy: 0,
      medium: 0,
      airHeavy: 0,
    };

    const { types, weights } = template;

    while (true) {
      const weightedPool = types.flatMap((type, i) =>
        Array(weights[i]).fill(type)
      );
      const pick = weightedPool[
        Math.floor(Math.random() * weightedPool.length)
      ] as keyof typeof unitCosts;
      const cost = unitCosts[pick];

      if (wavePoints - cost >= 0) {
        wave[pick] = (wave[pick] || 0) + 1;
        wavePoints -= cost;
      } else {
        const cheapest = Math.min(...types.map((t) => unitCosts[t]));
        if (wavePoints < cheapest) break;
      }
    }

    return {
      template: template.name,
      spawnPattern:
        spawnTemplates[Math.floor(Math.random() * spawnTemplates.length)],
      units: wave,
    };
  }

  spawnWavePositions(spawnPattern: string, unitCountByType: UnitCount) {
    const total = Object.values(unitCountByType).reduce(
      (acc, count) => acc + count,
      0
    );
    switch (spawnPattern) {
      case "line":
        return this.spawnLine(total);
      case "flank":
        return this.spawnFlank(total);
      case "surround":
        return this.spawnSurround(total);
      case "corner":
        return this.spawnCorner(total);
      default:
        return this.spawnLine(total);
    }
  }

  spawnCorner(count: number) {
    const corners = [
      { x: 0, y: 0 },
      { x: map.width, y: 0 },
      { x: 0, y: map.height },
      { x: map.width, y: map.height },
    ];

    return Array.from({ length: count }, () => {
      const corner = corners[Math.floor(Math.random() * corners.length)];
      const offset = 200;
      return {
        x: corner.x + (Math.random() * offset - offset / 2),
        y: corner.y + (Math.random() * offset - offset / 2),
      };
    });
  }

  spawnSurround(count: number, radius = 1500) {
    return Array.from({ length: count }, (_, i) => {
      const angle = (2 * Math.PI * i) / count;
      return {
        x: playerBase.x + Math.cos(angle) * radius,
        y: playerBase.y + Math.sin(angle) * radius,
      };
    });
  }

  spawnFlank(count: number) {
    const orientations = [
      ["left", "right"],
      ["top", "bottom"],
    ];
    const [a, b] =
      orientations[Math.floor(Math.random() * orientations.length)];

    const half = Math.ceil(count / 2);
    return [...this.spawnLine(half, a), ...this.spawnLine(half, b)];
  }

  spawnLine(count: number, from?: string) {
    const sides = ["top", "bottom", "left", "right"];
    const side = from ?? sides[Math.floor(Math.random() * sides.length)];

    return Array.from({ length: count }, () => {
      switch (side) {
        case "top":
          return { x: Math.random() * map.width, y: 0 };
        case "bottom":
          return { x: Math.random() * map.width, y: map.height };
        case "left":
          return { x: 0, y: Math.random() * map.height };
        case "right":
        default:
          return { x: map.width, y: Math.random() * map.height };
      }
    });
  }

  spawn() {
    const { units, positions } = this.nextWave;
    const unitsData: UnitsData = this.scene.cache.json.get("units");

    let i = 0;
    for (const [type, count] of Object.entries(units)) {
      for (let j = 0; j < count; j++) {
        const { x, y } = positions[i++];
        let unit = this.scene.units.get(x, y, type) as Unit | null;
        if (!unit) return;
        unit.initState(this.scene.controlPanel.playerBase, x, y, type, {
          ...unitsData[type as UnitType],
        });
      }
    }
  }

  generateNextWave(currentWave = 1) {
    const wave = this.generateWave(currentWave);

    const spawnPositions = this.spawnWavePositions(
      wave.spawnPattern,
      wave.units
    );

    this.nextWave = {
      units: wave.units,
      positions: spawnPositions,
    };
  }
}
