import { Scene } from "phaser";
import { Projectile } from "../Projectile";
import { ControlPanel } from "../entities/Player/ControlPanel/ControlPanel";
import { Commander } from "../entities/Enemy/Commander";
import { Unit } from "@/entities/Units/Unit";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  controlPanel: ControlPanel;
  commander: Commander;

  projectiles: Phaser.GameObjects.Group;
  units: Phaser.GameObjects.Group;
  ground: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("Game");
  }

  create() {
    this.scene.launch("GameUi");
    this.setupMap();
    this.setupPhysics();
    this.controlPanel = new ControlPanel(this);
    this.commander = new Commander(this);
    this.time.delayedCall(0, () => this.events.emit("gameReady"));
  }

  private setupPhysics() {
    this.physics.world.setBounds(
      -1024,
      -1024,
      2048 + 1024 * 2,
      2048 + 1024 * 2
    );

    this.projectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      collideWorldBounds: true,
    });

    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      const obj = body.gameObject as Phaser.Physics.Arcade.Image;
      // console.log("hit world bounds", obj.x, obj.y);
      obj.disableBody(true, true);
    });

    this.units = this.add.group({
      classType: Unit,
      runChildUpdate: true,
    });
    this.physics.add.overlap(this.projectiles, this.units, (obj1, obj2) => {
      const unit = obj1 as Unit;
      const proj = obj2 as Projectile;

      unit.getHit(proj.ammoData.damage);
      proj.disable();
    });
  }
  private setupMap() {
    this.add.image(0, 0, "map").setOrigin(0);
    this.add.image(1024, 1024, "base");
    const mapCam = this.cameras.main;

    mapCam.setViewport(448, 28, 1024, 1024);

    this.cameras.main.setBounds(0, 0, 2048, 2048);

    mapCam.setScroll(mapCam.width / 2, mapCam.height / 2);
  }
}
