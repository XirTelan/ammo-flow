import { Scene } from "phaser";
import { Turret } from "../Turret";
import { colors } from "@/helpers/config";
import { BaseButton } from "@/shared/ui/BaseButton";

const FILLBAR_Y = 80;

export class TurretUI {
  scene: Scene;
  ammoCount: Phaser.GameObjects.Text;
  status: Phaser.GameObjects.Text;
  name: Phaser.GameObjects.Text;
  turret: Turret;
  rangeIsOn: boolean = false;

  constructor(scene: Scene, x: number, y: number, turret: Turret) {
    this.scene = scene;
    const container = scene.add.container(x, y);
    this.name = scene.add.text(25, 10, ` ${turret.turretType.toUpperCase()}`, {
      color: "#2C2C2C",
      fontSize: "18px",
      fontStyle: "bold",
    });
    this.turret = turret;

    const maxLoad = scene.add
      .text(
        190,
        50,
        `${turret.turretConfig.ammoSizeLoad}\n${turret.turretConfig.ammoMaxLoad}`,
        {
          color: colors.textSecondary.hex,
          fontSize: "14px",
          fontStyle: "bold",
          align: "right",
        }
      )
      .setOrigin(1, 0);

    this.ammoCount = scene.add
      .text(235, 65, `${turret.ammoCount}`, {
        color: "#ECE3C6",
        fontSize: "24px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    const bg = scene.add.image(80, 105, "icon_reload_mask").setAngle(90);

    const ammoType = scene.add.text(
      30,
      98,
      `${turret.ammoType.toLocaleUpperCase()}`,
      {
        color: "#000",
        fontSize: "14px",
        fontStyle: "bold",
      }
    );

    this.status = scene.add.text(180, 100, `${turret.status}`, {
      color: "#2C2C2C",
      fontSize: "20px",
      fontStyle: "bold",
      align: "center",
    });

    turret.on("statusChange", (value: string) => {
      this.status.setText(value);
    });
    turret.on("ammoChange", (value: string) => {
      this.ammoCount.setText(`${value}`);
    });

    const showRange = scene.add
      .rectangle(340, 30, 40, 40, colors.overlay.number, 1)
      .setOrigin(0)
      .setInteractive()
      .on("pointerup", this.switchFireRangeZone, this);
    const fillBar = scene.add
      .rectangle(200, FILLBAR_Y, 5, 1, 0xffffff)
      .setOrigin(0.5, 1);
    turret.on("cd", (value: number) => {
      const pct = Phaser.Math.Clamp(value, 0, 1);
      fillBar.height = 30 * (1 - pct);
      fillBar.y = FILLBAR_Y - fillBar.height;
    });

    container.add([
      scene.add
        .rectangle(10, 10, 400, 25, colors.backgroundAccent.number, 1)
        .setOrigin(0),
      scene.add
        .rectangle(10, 30, 400, 100, colors.overlay.number, 1)
        .setOrigin(0),
      scene.add
        .image(20, 45, `${turret.turretType}_ui`)
        .setOrigin(0)
        .setScale(0.5),
      scene.add
        .rectangle(150, 90, 120, 35, colors.backgroundAccent.number, 1)
        .setOrigin(0),

      bg,
      ammoType,
      fillBar,
      this.name,
      maxLoad,
      this.status,
      this.ammoCount,
      showRange,
      scene.add.image(0, 0, "turret_panel").setOrigin(0),
    ]);

    this.createBtns(container);
  }

  switchFireRangeZone() {
    if (this.rangeIsOn) {
      this.hideFireRange();
      this.rangeIsOn = false;
    } else {
      this.showFireRange();
      this.rangeIsOn = true;
    }
  }

  showFireRange() {
    this.turret.showFireRange();
  }
  hideFireRange() {
    this.turret.hideFireRange();
  }

  createBtns(container: Phaser.GameObjects.Container) {
    const loadBtn = new BaseButton(
      this.scene,
      320,
      35,
      "load_normal",
      "load_over",
      "load_pressed"
    );

    const unloadBtn = new BaseButton(
      this.scene,
      385,
      35,
      "unload_normal",
      "unload_over",
      "unload_pressed"
    );

    const autloLoadBtn = new BaseButton(
      this.scene,
      395,
      100,
      "auto_load",
      "auto_load_over",
      "auto_load_pressed"
    );

    const rangeBtn = new BaseButton(
      this.scene,
      400,
      130,
      "turret_range",
      "turret_range_over",
      "turret_range_pressed"
    );
    rangeBtn.baseImage.on(
      "pointerdown",
      () => {
        rangeBtn.toggle();
        this.switchFireRangeZone();
      },
      this
    );

    const turretChangeAmmo = new BaseButton(
      this.scene,
      335,
      85,
      "turret_changeAmmo",
      "turret_changeAmmo_over",
      "turret_changeAmmo_pressed"
    );

    container.add([
      loadBtn.container,
      unloadBtn.container,
      autloLoadBtn.container,
      turretChangeAmmo.container,
      rangeBtn.container,
    ]);
  }
}
