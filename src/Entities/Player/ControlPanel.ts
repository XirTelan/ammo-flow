import { Scene } from "phaser";
import { Warehouse } from "./Warehouse";
import { Turret } from "../Towers/Turret";
import { Factory } from "./Factory";
import { Artillery } from "../Towers/Artillery";
import { MachineGun } from "../Towers/MachineGun";
import { Game } from "../../scenes/Game";
import { AllAmmoData } from "../../helpers/types";

const BASETIME = 15;
const FALLOFF = 0.9;
const MINTIME = 5;
export class ControlPanel {
  scene: Scene;
  warehouse: Warehouse = Warehouse.getInstance();
  turrets: Turret[] = [];
  factories: Factory[] = [];

  private _workers = 1;
  private _scientists = 0;
  private _health = 100;
  events: Phaser.Events.EventEmitter;

  private currentTime = 0;
  private wave = 1;

  text: Phaser.GameObjects.Text;
  constructor(scene: Game, wave = 1) {
    this.events = new Phaser.Events.EventEmitter();
    this.currentTime = this.getWaveDelay(wave);

    const { ammo }: { ammo: AllAmmoData } = scene.cache.json.get("ammo");
    Warehouse.getInstance().initiateState(ammo);

    this.text = scene.add.text(90, 650, "Ammo: 0", {
      fontSize: "16px",
    });

    this.warehouse.subscribe(`artillery.default`, (value) => {
      this.text.text = value;
    });

    this.factories.push(new Factory(scene, "artillery", "default"));

    this.turrets.push(new Artillery(scene, 1035, 850));
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
    return this._workers;
  }
  set workers(value: number) {
    this._workers = value;
    this.events.emit("money", value);
  }

  get scientists() {
    return this._scientists;
  }
  set scientists(value: number) {
    this._scientists = value;
    this.events.emit("score", value);
  }

  get health() {
    return this._health;
  }
  set health(value: number) {
    this._health = value;
    this.events.emit("health", value);
  }

  reset() {
    this._workers = 0;
    this._scientists = 0;
    this.health = 100;
  }

  getWaveDelay(n: number) {
    return Math.max(MINTIME, BASETIME * Math.pow(FALLOFF, n - 1));
  }

  update(time: number, delta: number) {
    if (this.factories.length > 0)
      this.factories.forEach((factory) => factory.update(time, delta));

    this.currentTime -= 0.1
    this.events.emit("timerUpdate", this.currentTime);
    if (this.currentTime <= 0) {
      this.events.emit("waveStart", this.wave);
      this.wave = this.wave + 1;
      this.currentTime = this.getWaveDelay(this.wave);
    }
  }
}
