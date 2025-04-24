import { Scene } from "phaser";
import { Turret } from "../../Turrets/Turret";
import { Artillery } from "../../Turrets/Artillery";
import { MachineGun } from "../../Turrets/MachineGun";
import { Game } from "../../../scenes/Game";
import { AllAmmoData } from "../../../helpers/types";
import { Warehouse } from "../Warehouse";
import { Factory } from "../Factories/Factory";

const BASETIME = 4;
const FALLOFF = 0.9;
const MINTIME = 5;
export class ControlPanel {
  scene: Scene;
  warehouse: Warehouse;
  turrets: Turret[] = [];
  factories: Factory[] = [];

  private _workersTotal = 1;
  workersAvailable = 1;
  private _health = 100;
  events: Phaser.Events.EventEmitter;

  private currentTime = 0;
  wave = 1;

  text: Phaser.GameObjects.Text;
  constructor(scene: Game, wave = 1) {
    this.scene = scene;
    this.events = new Phaser.Events.EventEmitter();
    this.currentTime = this.getWaveDelay(wave);

    const { ammo }: { ammo: AllAmmoData } = scene.cache.json.get("ammo");

    this.warehouse = Warehouse.getInstance();
    this.warehouse.initiateState(ammo);

    this.factories.push(new Factory(scene, this));
    this.factories.push(new Factory(scene, this));
    this.factories.push(new Factory(scene, this));
    this.factories.push(new Factory(scene, this));

    this.turrets.push(new MachineGun(scene, 1035, 850));
    this.turrets.push(new Artillery(scene, 830, 1020));
    this.turrets.push(new Artillery(scene, 1220, 1120));
    this.turrets.push(new MachineGun(scene, 991, 1200));

    scene.time.addEvent({
      delay: 100,
      loop: true,
      callback: this.update,
      callbackScope: this,
    });
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
  set health(value: number) {
    this._health = value;
    this.events.emit("health", value);
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
