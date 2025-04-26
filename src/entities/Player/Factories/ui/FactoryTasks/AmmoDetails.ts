import { colors } from "@/helpers/config";
import { AllAmmoData, AmmoVariant, TurretType } from "@/helpers/types";
import { Scene } from "phaser";

export class AmmoDetails {
  container: Phaser.GameObjects.Container;
  turretIcon: Phaser.GameObjects.Image;
  turretName: Phaser.GameObjects.Text;
  ammoText: Phaser.GameObjects.Text;
  ammoInfo: Phaser.GameObjects.Text;

  ammoTextLines: Phaser.GameObjects.GameObject[] = [];

  scene: Scene;
  constructor(scene: Scene, x: number, y: number) {
    this.scene = scene;
    this.turretIcon = scene.add
      .image(20, 60, "machineGun_ui")
      .setScale(0.5)
      .setOrigin(0);
    this.turretName = scene.add.text(180, 60, "NO AMMO SELECTED", {
      fontSize: "24px",
      fontStyle: "bold",
      color: colors.textPrimary.hex,
    });
    this.ammoText = scene.add.text(180, 80, "", {
      fontSize: "24px",
      color: colors.textPrimary.hex,
    });
    this.ammoInfo = scene.add.text(0, 100, "", {
      fontSize: "24px",
      color: colors.textPrimary.hex,
    });
    this.container = scene.add.container(x, y, [
      scene.add.rectangle(0, 0, 450, 240, colors.overlay.number).setOrigin(0),
      scene.add
        .rectangle(0, 0, 450, 40, colors.backgroundAccent.number)
        .setOrigin(0),
      scene.add.text(10, 10, "AMMO DETAILS:", {
        color: "#000",
        fontSize: "20px",
        fontStyle: "bold",
      }),
      this.turretIcon,
      this.turretName,
      this.ammoText,
      this.ammoInfo,
    ]);
    this.container.setDepth(1);
    this.container.setVisible(false);
  }

  private renderAmmoInfo(data: AmmoVariant) {
    if (this.ammoTextLines.length > 0) {
      this.ammoTextLines.forEach((obj) => obj.destroy());
      this.ammoTextLines = [];
    }

    let x = 20;
    let y = 110;
    let count = 0;

    for (const [key, value] of Object.entries(data)) {
      const keyText = this.scene.add.text(x, y, `${key.toUpperCase()}: `, {
        fontSize: "18px",
        color: colors.textPrimary.hex,
      });

      const valueText = this.scene.add.text(x + keyText.width, y, `${value}`, {
        fontSize: "18px",
        color: "#FFF",
        fontStyle: "bold",
      });

      this.container.add([keyText, valueText]);
      this.ammoTextLines.push(keyText, valueText);

      if (count % 2 === 1) {
        y += 24;
        x = 20;
      } else {
        x = 240;
      }
      count++;
    }
  }

  update(turret: TurretType, variant: string) {
    const { ammo }: { ammo: AllAmmoData } = this.scene.cache.json.get("ammo");
    this.turretIcon.setTexture(`${turret}_ui`);
    this.turretName.setText(turret.toLocaleUpperCase());
    this.ammoText.setText(variant.toLocaleUpperCase());
    const selectedAmmo = ammo[turret][variant];
    this.renderAmmoInfo(selectedAmmo);
  }

  show() {
    this.container.setVisible(true);
  }

  hide() {
    this.container.setVisible(false);
    this.ammoInfo.setText("");
  }
}
