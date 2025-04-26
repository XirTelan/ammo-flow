import { Turret } from "../../Turrets/Turret";
import { Artillery } from "../../Turrets/Artillery";
import { MachineGun } from "../../Turrets/MachineGun";
import { Game } from "../../../scenes/Game";
import { AllAmmoData } from "../../../helpers/types";
import { Warehouse } from "../Warehouse";
import { Factory } from "../Factories/Factory";
import { Projectile } from "@/Projectile";
import { PlasmaCannon } from "@/entities/Turrets/PlasmaCannon";
import { FlakCannon } from "@/entities/Turrets/FlakCannon";
import { Railgun } from "@/entities/Turrets/RailGun";

const TurretClasses = {
  MachineGun,
  Artillery,
  Railgun,
  FlakCannon,
  PlasmaCannon,
} as const;

type TurretData = { type: keyof typeof TurretClasses; x: number; y: number };

const LEVEL_DATA = {
  turrets: [
    { type: "MachineGun", x: 845, y: 855 },
    { type: "MachineGun", x: 1235, y: 900 },
    { type: "MachineGun", x: 925, y: 1190 },
    { type: "Artillery", x: 900, y: 1005 },
    { type: "Railgun", x: 1005, y: 1000 },
    { type: "FlakCannon", x: 1085, y: 1090 },
    { type: "PlasmaCannon", x: 1055, y: 920 },
  ],
} satisfies {
  turrets: TurretData[];
};

const BASETIME = 45;
const FALLOFF = 0.95;
const MINTIME = 5;

export class ControlPanel {
  scene: Game;
  warehouse: Warehouse;
  turrets: Turret[] = [];
  factories: Factory[] = [];

  private _workersTotal = 1;
  workersAvailable = 1;

  playerBase: Phaser.GameObjects.Rectangle;
  lastAlertTime = 0;
  alertCooldown = 1000;

  private _healthMax = 1000;
  private _health = this._healthMax;
  events: Phaser.Events.EventEmitter;

  private currentTime = 0;
  wave = 1;

  text: Phaser.GameObjects.Text;
  constructor(scene: Game, wave = 1) {
    this.scene = scene;
    this.events = new Phaser.Events.EventEmitter();
    this.currentTime = this.getWaveDelay(wave);

    const { ammo }: { ammo: AllAmmoData } = scene.cache.json.get("ammo");

    this.warehouse = new Warehouse(ammo);
    // debugger;

    this.factories.push(new Factory(scene, this));
    this.factories.push(new Factory(scene, this));
    this.factories.push(new Factory(scene, this));
    this.factories.push(new Factory(scene, this));

    LEVEL_DATA.turrets.forEach(({ type, x, y }) => {
      const TurretClass = TurretClasses[type];
      if (TurretClass) {
        this.turrets.push(new TurretClass(scene, this.warehouse, x, y));
      } else {
        console.warn(`Unknown turret type: ${type}`);
      }
    });

    this.playerBase = this.scene.add.rectangle(
      1024,
      1024,
      200,
      200,
      0x000000,
      0
    );
    scene.physics.add.existing(this.playerBase);
    const playerBase = this.playerBase.body as Phaser.Physics.Arcade.Body;
    playerBase.setAllowGravity(false);
    playerBase.setImmovable(true);
    this.scene.physics.add.overlap(
      this.playerBase,
      scene.enemyProjectiles,
      (_playerBase, projectile) => {
        const proj = projectile as Projectile;
        this.playSoftAlert();
        this.health -= proj.ammoData.damage;
        proj.disable();
      }
    );

    scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: this.update,
      callbackScope: this,
    });
  }

  playSoftAlert() {
    const now = this.scene.time.now;
    if (now - this.lastAlertTime > this.alertCooldown) {
      this.scene.sound.play("softAlert");
      this.lastAlertTime = now;
    }
  }

  get workers() {
    return this._workersTotal;
  }
  set workers(value: number) {
    this._workersTotal = value;
    this.events.emit("workers", value);
  }

  get health() {
    return this._health;
  }
  get healthMax() {
    return this._healthMax;
  }
  set health(value: number) {
    this._health = Phaser.Math.Clamp(value, 0, this._healthMax);
    this.events.emit("health", value);
    if (this._health <= 0) {
      this.gameOver();
    }
  }

  gameOver() {
    this.scene.scene.pause();
    this.scene.input.enabled = false;
    this.scene.game.scene.stop("GameUi");
    this.scene.scene.start("GameOver");
  }

  reset() {
    this._workersTotal = 1;
    this.health = 100;
  }

  getWaveDelay(n: number) {
    return Math.max(MINTIME, BASETIME * Math.pow(FALLOFF, n - 1));
  }

  update() {
    if (this.factories.length > 0)
      this.factories.forEach((factory) => factory.update());

    this.currentTime -= 0.1;
    if (this.currentTime <= 0) {
      this.events.emit("waveStart", this.wave);
      this.wave = this.wave + 1;
      this.addWorker(1);
      this.currentTime = this.getWaveDelay(this.wave);
    }
    this.events.emit("timerUpdate", this.currentTime);
  }

  private addWorker(count: number) {
    this._workersTotal += count;
    this.workersAvailable += count;
    this.events.emit("totalWorkersChange", this._workersTotal);
    this.events.emit("activeWorkersChange", this.workersAvailable);
  }

  takeWorker(amount: number) {
    this.workersAvailable -= amount;
    this.events.emit("activeWorkersChange", this.workersAvailable);
  }

  returnWorker(amount: number) {
    this.workersAvailable += amount;
    this.events.emit("activeWorkersChange", this.workersAvailable);
  }

  createFactory() {}

  createTurret() {}
}
