import { Scene } from "phaser";
import { Turret } from "../Entities/Towers/Turret";
import { Projectile } from "../Entities/Projectile";
import { Unit } from "../Entities/Units/Unit";
import { Artillery } from "../Entities/Towers/Artillery";
import { Warehouse } from "../Entities/Player/Warehouse";
import { Factory } from "../Entities/Player/Factory";
import { MachineGun } from "../Entities/Towers/MachineGun";
import { ControlPanel } from "../Entities/Player/ControlPanel";
import { AllAmmoData } from "../helpers/types";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  towers: Turret[];
  factories: Factory[];
  projectiles: Phaser.GameObjects.Group;
  units: Phaser.GameObjects.Group;
  ground: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("Game");
    this.towers = [];
  }

  create() {
    this.setupMap();
    this.setupPhysics();
    this.loadUi();
  }
  private initGame() {
    const { ammo }: { ammo: AllAmmoData } = this.cache.json.get("ammo");

    Warehouse.getInstance().init(ammo);
    new ControlPanel(this);

    this.factories = [];
    this.devTest();
  }
  private loadUi() {
    this.scene.launch("GameUi");

    const uiScene = this.scene.get("GameUi");
    uiScene.events.once("ui-ready", () => {
      console.log("[Game] UI is ready! Go time");
      this.initGame();
    });
  }
  private setupPhysics() {
    this.physics.world.setBounds(0, 0, 2048, 2048);

    this.projectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      collideWorldBounds: true,
    });

    this.physics.world.on("worldbounds", (body) => {
      const obj = body.gameObject;
      console.log("hit bound");

      obj.setActive(false).setVisible(false);
    });

    this.units = this.add.group({
      runChildUpdate: true,
    });
    this.physics.add.overlap(this.projectiles, this.units);
  }
  private setupMap() {
    this.add.image(0, 0, "map").setOrigin(0);
    this.add.image(1024, 1024, "base")
    const mapCam = this.cameras.main;

    mapCam.setViewport(448, 28, 1024, 1024);

    this.input.on("pointerdown", (pointer) => {
      this.startPointer = { x: pointer.x, y: pointer.y };
      this.startScroll = { x: mapCam.scrollX, y: mapCam.scrollY };
    });

    this.input.on("pointermove", (pointer) => {
      if (pointer.isDown && this.startPointer) {
        const dx = pointer.x - this.startPointer.x;
        const dy = pointer.y - this.startPointer.y;
        mapCam.scrollX = this.startScroll.x - dx / mapCam.zoom;
        mapCam.scrollY = this.startScroll.y - dy / mapCam.zoom;
      }
    });
    this.input.on("wheel", (pointer, gameObjects, deltaX, deltaY) => {
      const zoomFactor = 0.001;
      mapCam.zoom = Phaser.Math.Clamp(
        mapCam.zoom - deltaY * zoomFactor,
        0.5,
        2
      );
    });
    this.cameras.main.setBounds(0, 0, 2048, 2048);

    mapCam.setScroll(mapCam.width / 2, mapCam.height / 2);
  }

  update(time: number, delta: number): void {
    if (this.factories.length > 0)
      this.factories.forEach((factory) => factory.update(time, delta));
    if (this.towers.length > 0)
      this.towers.forEach((tower) => tower.update(time, delta));
  }

  devTest() {
    this.factories.push(new Factory(this, "artillery", "default"));

    for (let i = 0; i < 30; i++) {
      const angle = Phaser.Math.DegToRad((360 / 30) * i);
      const x = 1024 + 1000 * Math.cos(angle);
      const y = 1024 + 1000 * Math.sin(angle);

      this.units.add(new Unit(this, x, y, "light"));
    }

    this.towers.push(new Artillery(this, 1035, 850));
    this.towers.push(new Artillery(this, 830, 1020));
    this.towers.push(new Artillery(this, 1220, 1120));
    this.towers.push(new MachineGun(this, 991, 1200));
  }
}
