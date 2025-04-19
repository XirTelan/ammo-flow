import { Scene } from "phaser";
import { Projectile } from "../Entities/Projectile";
import { Unit } from "../Entities/Units/Unit";
import { ControlPanel } from "../Entities/Player/ControlPanel";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;

  controlPanel: ControlPanel;

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
    this.controlPanel = new ControlPanel(this);
    this.setupMap();
    this.setupPhysics();
    this.initGame();
    this.time.delayedCall(0, () => this.events.emit("gameReady"));
  }
  private initGame() {
    this.controlPanel = new ControlPanel(this);

    this.devTest();
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
      runChildUpdate: true,
    });
    this.physics.add.overlap(this.projectiles, this.units);
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
        const zoomFactor = 0.001;
        mapCam.zoom = Phaser.Math.Clamp(
          mapCam.zoom - deltaY * zoomFactor,
          0.5,
          2
        );
      }
    );
    this.cameras.main.setBounds(0, 0, 2048, 2048);

    mapCam.setScroll(mapCam.width / 2, mapCam.height / 2);
  }

  update(time: number, delta: number): void {
    this.controlPanel.update(time, delta);
  }

  devTest() {
    for (let i = 0; i < 30; i++) {
      const angle = Phaser.Math.DegToRad((360 / 30) * i);
      const x = 1024 + 800 * Math.cos(angle);
      const y = 1024 + 800 * Math.sin(angle);

      this.units.add(new Unit(this, x, y, "light"));
    }
  }
}
