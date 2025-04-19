import { Scene } from "phaser";
import { Turret } from "../../Entities/Towers/Turret";

export class TurretUI {
  ammoCount: Phaser.GameObjects.Text;
  status: Phaser.GameObjects.Text;
  name: Phaser.GameObjects.Text;

  constructor(scene: Scene, x: number, y: number, turret: Turret) {
    const container = scene.add.container(x, y);
    this.name = scene.add.text(0, 55, ` ${turret.turretType}`, {
      color: "#2C2C2C",
      fontSize: "20px",
      fontStyle: "bold",
    });

    this.ammoCount = scene.add.text(
      250,
      85,
      `AMMO\n${turret.getAmmoStatus()}`,
      {
        color: "#ECE3C6",
        fontSize: "20px",
        fontStyle: "bold",
        align: "center",
      }
    );

    this.status = scene.add.text(250, 130, `${turret.status}`, {
      color: "#2C2C2C",
      fontSize: "20px",
      fontStyle: "bold",
    });

    turret.on("statusChange", (value: string) => {
      console.log("status work?");
      this.status.setText(value);
    });
    turret.on("ammoChange", (value: string) => {
      console.log("status work?");
      this.ammoCount.setText(`AMMO\n${value}`);
    });

    container.add([
      scene.add.rectangle(0, 55, 400, 40, 0xe6e8ec, 1).setOrigin(0),
      scene.add.rectangle(0, 75, 400, 5, 0x8a8372, 1).setOrigin(0),
      scene.add.rectangle(0, 80, 400, 80, 0x6d6a59, 1).setOrigin(0),
      scene.add.rectangle(0, 155, 400, 5, 0x8a8372, 1).setOrigin(0),
      scene.add
        .image(90, 90, `${turret.turretType}_ui`)
        .setOrigin(0)
        .setScale(0.6),
      scene.add.rectangle(240, 125, 90, 30, 0xe6e8ec, 1).setOrigin(0),
      this.name,
      this.status,
      this.ammoCount,
      scene.add.rectangle(0, 75, 70, 85, 0x000000, 1).setOrigin(0),
      scene.add.rectangle(330, 75, 70, 85, 0x000000, 1).setOrigin(0),
    ]);
  }
}
