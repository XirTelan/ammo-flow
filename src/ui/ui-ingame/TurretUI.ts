import { Scene } from "phaser";
import { Turret } from "../../Entities/Towers/Turret";
import { colors } from "../../helpers/config";

export class TurretUI {
  ammoCount: Phaser.GameObjects.Text;
  status: Phaser.GameObjects.Text;
  name: Phaser.GameObjects.Text;
  turret: Turret;
  rangeIsOn: boolean = false;

  constructor(scene: Scene, x: number, y: number, turret: Turret) {
    const container = scene.add.container(x, y);
    this.name = scene.add.text(0, 5, ` ${turret.turretType.toUpperCase()}`, {
      color: "#2C2C2C",
      fontSize: "20px",
      fontStyle: "bold",
    });
    this.turret = turret;

    const maxLoad = scene.add
      .text(
        180,
        40,
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
      .text(225, 55, `${turret.ammoCount}`, {
        color: "#ECE3C6",
        fontSize: "24px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    const bg = scene.add.image(70, 95, "icon_reload_mask").setAngle(90);

    const ammoType = scene.add.text(
      20,
      88,
      `${turret.ammoType.toLocaleUpperCase()}`,
      {
        color: "#000",
        fontSize: "14px",
        fontStyle: "bold",
      }
    );

    this.status = scene.add.text(170, 85, `${turret.status}`, {
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
      .rectangle(190, 70, 5, 1, 0xffffff)
      .setOrigin(0.5, 1);
    turret.on("cd", (value) => {
      const pct = Phaser.Math.Clamp(value, 0, 1);
      fillBar.height = 30 * (1 - pct);
      fillBar.y = 70 - fillBar.height;
    });

    container.add([
      scene.add
        .rectangle(0, 0, 400, 25, colors.backgroundAccent.number, 1)
        .setOrigin(0),
      scene.add.rectangle(0, 25, 400, 5, colors.border.number, 1).setOrigin(0),
      scene.add
        .rectangle(0, 30, 400, 80, colors.overlay.number, 1)
        .setOrigin(0),
      scene.add.rectangle(0, 110, 400, 5, colors.border.number, 1).setOrigin(0),
      scene.add
        .image(10, 35, `${turret.turretType}_ui`)
        .setOrigin(0)
        .setScale(0.5),
      scene.add
        .rectangle(140, 80, 120, 30, colors.backgroundAccent.number, 1)
        .setOrigin(0),
      scene.add.rectangle(260, 25, 140, 85, 0x000000, 1).setOrigin(0),

      bg,
      ammoType,
      fillBar,
      this.name,
      maxLoad,
      this.status,
      this.ammoCount,
      showRange,
    ]);
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
}
