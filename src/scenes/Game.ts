import { Scene } from "phaser";
import { Projectile } from "../Entities/Projectile";
import { Unit } from "../Entities/Units/Unit";
import { ControlPanel } from "../Entities/Player/ControlPanel";
import { Commander } from "../Entities/Enemy/Commander";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  controlPanel: ControlPanel;
  commander: Commander;

  projectiles: Phaser.GameObjects.Group;
  units: Phaser.GameObjects.Group;
  ground: Phaser.Physics.Arcade.StaticGroup;

  startPointer: Phaser.Types.Math.Vector2Like;
  startScroll: Phaser.Types.Math.Vector2Like;

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
    this.physics.world.setBounds(0, 0, 2048, 2048);

    this.projectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      collideWorldBounds: true,
    });

    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      const obj = body.gameObject as Phaser.Physics.Arcade.Image;
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
    });
  }
  private setupMap() {
    this.add.image(0, 0, "map").setOrigin(0);
    this.add.image(1024, 1024, "base");
    const mapCam = this.cameras.main;

    mapCam.setViewport(448, 28, 1024, 1024);

    this.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      this.startPointer = { x: pointer.x, y: pointer.y };
      this.startScroll = { x: mapCam.scrollX, y: mapCam.scrollY };
    });

    this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (pointer.isDown && this.startPointer) {
        const dx = pointer.x - this.startPointer.x;
        const dy = pointer.y - this.startPointer.y;
        mapCam.scrollX = this.startScroll.x - dx / mapCam.zoom;
        mapCam.scrollY = this.startScroll.y - dy / mapCam.zoom;
      }
    });
    this.input.on(
      "wheel",
      (
        _pointer: Phaser.Input.Pointer,
        _gameObjects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number
      ) => {
        const zoomFactor = 0.002;
        mapCam.zoom = Phaser.Math.Clamp(
          mapCam.zoom - deltaY * zoomFactor,
          0.5,
          2
        );
        this.events.emit("mapZoom", mapCam.zoom);
      }
    );
    this.cameras.main.setBounds(0, 0, 2048, 2048);

    mapCam.setScroll(mapCam.width / 2, mapCam.height / 2);
  }
}
