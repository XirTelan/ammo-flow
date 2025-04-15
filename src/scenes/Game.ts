import { Scene } from "phaser";
import { Turret } from "../Entities/Towers/Turret";
import { Projectile } from "../Entities/Projectile";
import { Unit } from "../Entities/Units/Unit";
import { AllAmmo } from "../helpers/types";
import { Artillery } from "../Entities/Towers/Artillery";
import { Warehouse } from "../Entities/Player/Warehouse";
import { Factory } from "../Entities/Player/Factory";
import { MachineGun } from "../Entities/Towers/MachineGun";
import { ControlPanel } from "../Entities/Player/ControlPanel";

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
    const { ammo }: { ammo: AllAmmo } = this.cache.json.get("ammo");

    Warehouse.getInstance().init(ammo);
    new ControlPanel(this);

    this.towers.push(new Artillery(this, 100, 400));
    this.towers.push(new Artillery(this, 100, 100));
    this.towers.push(new MachineGun(this, 200, 500));

    this.projectiles = this.add.group({
      classType: Projectile,
      runChildUpdate: true,
    });

    this.factories = [];
    this.factories.push(new Factory(this, "artillery", "default"));

    const groundRect = this.add
      .rectangle(0, 580, this.cameras.main.width + 1000, 40, 0x00ff00)
      .setOrigin(0);

    this.physics.add.existing(groundRect, true);

    this.ground = groundRect;

    this.physics.add.collider(
      this.projectiles,
      this.ground,
      (projectile, ground) => {
        projectile.setActive(false);
        projectile.setVisible(false);
      }
    );
    this.units = this.add.group({
      runChildUpdate: true,
    });
    this.physics.add.overlap(this.projectiles, this.units);
    this.physics.add.collider(this.units, this.ground);

    const enemy = new Unit(this, 2100, 400, "Etheros");
    this.units.add(enemy);
    this.units.add(new Unit(this, 2000, 400, "Etheros"));

    // const ammoText = this.add.text(200, 700, "", {
    //   fontFamily: "monospace",
    //   fontSize: "24px",
    //   color: "#ffffff",
    // });
  }

  update(time: number, delta: number): void {
    if (this.factories.length > 0)
      this.factories.forEach((factory) => factory.update(time, delta));
    if (this.towers.length > 0)
      this.towers.forEach((tower) => tower.update(time, delta));
  }
}
