import { Scene } from "phaser";
import { Projectile } from "../Projectile";
import { ControlPanel } from "../entities/Player/ControlPanel/ControlPanel";
import { Commander } from "../entities/Enemy/Commander";
import { Unit } from "@/entities/Units/Unit";
import { colors } from "@/helpers/config";
import { Effects } from "@/shared/Effects";

export class Game extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;

  splashGraphics: Phaser.GameObjects.Graphics;

  controlPanel: ControlPanel;
  commander: Commander;

  projectiles: Phaser.GameObjects.Group;
  enemyProjectiles: Phaser.GameObjects.Group;

  units: Phaser.GameObjects.Group;
  ground: Phaser.Physics.Arcade.StaticGroup;

  constructor() {
    super("Game");
  }

  create() {
    this.scene.launch("GameUi");
    this.setupMap();
    this.setupPhysics();
    this.setupEntities();

    this.splashGraphics = this.add.graphics();

    this.time.delayedCall(50, () => this.events.emit("gameReady"));
  }

  private setupEntities() {
    this.controlPanel = new ControlPanel(this);
    this.commander = new Commander(this);
  }

  private setupMap() {
    this.add.image(0, 0, "map").setOrigin(0);
    this.add.image(0, 0, "grid").setOrigin(0).setDepth(1);
    this.add.image(1024, 1024, "base");

    const mapCam = this.cameras.main;
    mapCam.setViewport(448, 28, 1024, 1024);
    mapCam.setBounds(0, 0, 2048, 2048);
    mapCam.setScroll(mapCam.width / 2, mapCam.height / 2);

    Effects.createPulseShimmer(this, mapCam.width * 2, mapCam.height * 2, 20);
  }

  private setupPhysics() {
    this.physics.world.setBounds(-1024, -1024, 4096, 4096);

    this.projectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      collideWorldBounds: true,
    });

    this.enemyProjectiles = this.physics.add.group({
      classType: Projectile,
      runChildUpdate: true,
      collideWorldBounds: true,
    });

    this.units = this.add.group({
      classType: Unit,
      runChildUpdate: true,
    });

    this.setupWorldBoundsHandler();
    this.setupProjectileUnitOverlap();
  }

  private setupWorldBoundsHandler() {
    this.physics.world.on("worldbounds", (body: Phaser.Physics.Arcade.Body) => {
      const obj = body.gameObject as Phaser.Physics.Arcade.Image;
      obj.disableBody(true, true);
    });
  }

  private setupProjectileUnitOverlap() {
    this.physics.add.overlap(this.projectiles, this.units, (obj1, obj2) => {
      const unit = obj1 as Unit;
      const proj = obj2 as Projectile;

      if (unit.unitConfig.type !== proj.ammoData.type) return;

      const { damage, ap = 0, splashRadius = 0 } = proj.ammoData;
      const effectiveDamage = this.calculateDamage(damage, ap, unit);
      unit.getHit(effectiveDamage);

      if (splashRadius > 0 && unit.body?.center) {
        this.handleSplashDamage(unit, proj, splashRadius);
      }

      proj.disable();
    });
  }

  private calculateDamage(baseDamage: number, ap: number, target: Unit) {
    const armorReduction = target.unitConfig.armor * (1 - ap);
    return baseDamage * (100 / (100 + armorReduction));
  }

  togglePause() {
    const isPaused = this.scene.isPaused();
    if (isPaused) {
      this.scene.resume();
    } else {
      this.scene.pause();
    }
    this.events.emit("pause", !isPaused);
  }
  pauseGame() {
    const isPaused = this.scene.isPaused();
    if (!isPaused) {
      this.scene.pause();
      this.events.emit("pause", true);
    }
  }
  resumeGame() {
    const isPaused = this.scene.isPaused();
    if (isPaused) {
      this.scene.resume();
      this.events.emit("pause", false);
    }
  }

  setTimeScale(physScale: number, timeScale: number) {
    if (this.scene.isPaused()) {
      this.scene.resume();
    }
    this.physics.world.timeScale = physScale;
    this.time.timeScale = timeScale;
  }

  private handleSplashDamage(
    unit: Unit,
    proj: Projectile,
    splashRadius: number
  ) {
    const center = unit.body!.center;

    this.splashGraphics.clear();
    this.splashGraphics.fillStyle(colors.accentWarning.number, 0.8);
    this.splashGraphics.fillCircle(center.x, center.y, splashRadius);

    this.tweens.add({
      targets: this.splashGraphics,
      duration: 300,
      ease: "Cubic.easeOut",
      onComplete: () => {
        this.splashGraphics.clear();
        this.splashGraphics.alpha = 1;
      },
    });

    const nearbyUnits = this.physics.overlapCirc(
      center.x,
      center.y,
      splashRadius
    );

    nearbyUnits.forEach((body) => {
      const obj = body.gameObject;
      if (!obj || obj === unit || !(obj instanceof Unit) || !obj.body?.center)
        return;

      if (
        obj.unitConfig?.type === proj.ammoData.type &&
        Phaser.Math.Distance.BetweenPoints(center, obj.body.center) <=
          splashRadius
      ) {
        const splashDmg = this.calculateDamage(
          proj.ammoData.damage,
          proj.ammoData.ap ?? 0,
          obj
        );
        obj.getHit(splashDmg);
      }
    });
  }
}
