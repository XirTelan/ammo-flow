import { Scene } from "phaser";
import { Turret } from "../Turret";
import { colors } from "@/helpers/config";
import { BaseButton } from "@/shared/ui/BaseButton";
import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";
import { AllAmmoData } from "@/helpers/types";

const FILLBAR_Y = 80;

export class TurretUI {
  scene: Scene;
  turret: Turret;
  rangeIsOn = false;

  ammoCount: Phaser.GameObjects.Text;
  ammoType: Phaser.GameObjects.Text;
  status: Phaser.GameObjects.Text;
  name: Phaser.GameObjects.Text;

  changeAmmo: Phaser.GameObjects.Container;

  constructor(scene: Scene, x: number, y: number, turret: Turret) {
    this.scene = scene;
    this.turret = turret;

    const container = scene.add.container(x, y);
    this.createBackground(container);
    this.createTexts(container);
    this.createFillBar(container);
    this.createBtns(container);
    this.registerTurretEvents();
    this.createChangeAmmoPanel(container);
  }

  private createBackground(container: Phaser.GameObjects.Container) {
    container.add([
      this.scene.add
        .rectangle(10, 10, 300, 25, colors.backgroundAccent.number)
        .setOrigin(0),
      this.scene.add
        .rectangle(10, 30, 300, 100, colors.overlay.number)
        .setOrigin(0),
      this.scene.add
        .image(20, 45, `${this.turret.turretType}_ui`)
        .setOrigin(0)
        .setScale(0.5),
      this.scene.add
        .rectangle(150, 90, 120, 35, colors.backgroundAccent.number)
        .setOrigin(0),
      this.scene.add.image(0, 0, "turret_panel").setOrigin(0),
      this.scene.add.image(80, 115, "icon_reload_mask").setAngle(90),
    ]);
  }

  private createTexts(container: Phaser.GameObjects.Container) {
    const { scene, turret } = this;

    this.name = scene.add.text(25, 10, ` ${turret.turretType.toUpperCase()}`, {
      color: "#2C2C2C",
      fontSize: "18px",
      fontStyle: "bold",
    });

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

    this.ammoType = scene.add.text(
      30,
      107,
      `${turret.ammoType.toUpperCase()}`,
      {
        color: "#000",
        fontSize: "16px",
        fontStyle: "bold",
      }
    );

    this.status = scene.add.text(180, 100, `${turret.status}`, {
      color: "#2C2C2C",
      fontSize: "20px",
      fontStyle: "bold",
      align: "center",
    });

    container.add([
      this.name,
      maxLoad,
      this.ammoCount,
      this.ammoType,
      this.status,
    ]);
  }

  private createFillBar(container: Phaser.GameObjects.Container) {
    const fillBar = this.scene.add
      .rectangle(200, FILLBAR_Y, 5, 1, 0xffffff)
      .setOrigin(0.5, 1);

    this.turret.on("cd", (value: number) => {
      const pct = Phaser.Math.Clamp(value, 0, 1);
      fillBar.height = 30 * (1 - pct);
      fillBar.y = FILLBAR_Y - fillBar.height;
    });

    container.add([fillBar]);
  }

  private registerTurretEvents() {
    this.turret.on("statusChange", (value: string) => {
      this.status.setText(value);
    });

    this.turret.on("ammoChange", (value: string) => {
      this.ammoCount.setText(`${value}`);
    });
    this.turret.on("ammoTypeChange", (value: string) => {
      this.ammoType.setText(`${value.toUpperCase()}`);
    });
  }

  private createBtns(container: Phaser.GameObjects.Container) {
    const { scene, turret } = this;

    const loadBtn = new BaseButton(
      scene,
      320,
      35,
      "load_normal",
      "load_over",
      "load_pressed"
    );
    const unloadBtn = new BaseButton(
      scene,
      385,
      35,
      "unload_normal",
      "unload_over",
      "unload_pressed"
    );

    const autoLoadBtn = new BaseButton(
      scene,
      395,
      93,
      "auto_load",
      "auto_load_over",
      "auto_load_pressed"
    );
    autoLoadBtn.baseImage.on("pointerup", () => {
      turret.switchAutoLoading();
      autoLoadBtn.setActive(turret.isAutoLoading);
    });

    const rangeBtn = new BaseButton(
      scene,
      400,
      130,
      "turret_range",
      "turret_range_over",
      "turret_range_pressed"
    );
    rangeBtn.baseImage.on("pointerdown", () => {
      rangeBtn.toggle();
      this.switchFireRangeZone();
    });

    const changeAmmoBtn = new BaseButton(
      scene,
      330,
      90,
      "turret_changeAmmo",
      "turret_changeAmmo_over",
      "turret_changeAmmo_pressed"
    );

    loadBtn.baseImage.on("pointerup", turret.loadAmmo, turret);
    unloadBtn.baseImage.on("pointerup", turret.unloadAmmo, turret);
    changeAmmoBtn.baseImage.on("pointerup", this.toggleChangeAmmoPanel, this);

    container.add([
      loadBtn.container,
      unloadBtn.container,
      autoLoadBtn.container,
      rangeBtn.container,
      changeAmmoBtn.container,
    ]);
  }

  private switchFireRangeZone() {
    this.rangeIsOn = !this.rangeIsOn;
    this.rangeIsOn ? this.turret.showFireRange() : this.turret.hideFireRange();
  }
  private createChangeAmmoPanel(container: Phaser.GameObjects.Container) {
    const { ammo }: { ammo: AllAmmoData } = this.scene.cache.json.get("ammo");
    const variants = Object.keys(ammo[this.turret.turretType]);

    const panelWidth = 255;
    const panelHeight = 85;
    const columnSpacing = 100;
    const rowSpacing = 50;

    this.changeAmmo = this.scene.add.container(0, 0);

    const bg = this.scene.add
      .rectangle(15, 40, panelWidth, panelHeight, colors.overlay.number)
      .setOrigin(0);

    const buttons: Phaser.GameObjects.Container[] = variants.map(
      (variant, index) => {
        const col = index % 2;
        const row = Math.floor(index / 2);
        const offsetY = 45 + row * rowSpacing;
        const offsetX = 5 + col * columnSpacing;

        const btn = new TaskButton(
          this.scene,
          offsetY,
          variant.toUpperCase(),
          () => {
            this.turret.setAmmoType(variant);
            this.hideChangeAmmoPanel();
          },
          false,
          120
        );

        btn.container.setX(offsetX);
        btn.container.setScale(0.8);
        return btn.container;
      }
    );

    this.changeAmmo.add([bg, ...buttons]);
    this.hideChangeAmmoPanel();
    container.add(this.changeAmmo);
  }

  toggleChangeAmmoPanel() {
    this.changeAmmo.visible
      ? this.hideChangeAmmoPanel()
      : this.showChangeAmmoPanel();
  }

  hideChangeAmmoPanel() {
    this.changeAmmo.setVisible(false);
  }
  showChangeAmmoPanel() {
    this.changeAmmo.setVisible(true);
  }
}
