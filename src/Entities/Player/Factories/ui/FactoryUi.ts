import { Scene } from "phaser";
import { Factory } from "../Factory";
import { colors } from "@/helpers/config";
import { Warehouse } from "../../Warehouse";
import { FACTORY_UI_HEIGHT } from "../constants";
import { Effects } from "@/shared/Effects";
const WIDTH = 360;
const BORDER = 5;
const PADDING = 25;

const TEXT_STYLE = {
  fontSize: "24px",
  color: "#444",
  fontFamily: "Lucida Console, monospace",
  fontStyle: "bold",
};

export class FactoryUi {
  scene: Scene;
  container: Phaser.GameObjects.Container;
  controlsContainer: Phaser.GameObjects.Container;
  private currentEvent: string;

  progressBar: Phaser.GameObjects.Rectangle;

  textTask: Phaser.GameObjects.Text;
  productionText: Phaser.GameObjects.Text;
  ammoStock: Phaser.GameObjects.Text;

  warehouse: Warehouse;
  factory: Factory;

  constructor(
    scene: Scene,
    warehouse: Warehouse,
    x: number,
    y: number,
    factory: Factory
  ) {
    this.factory = factory;
    this.scene = scene;
    this.warehouse = warehouse;

    this.container = scene.add.container(x, y);

    this.textTask = scene.add
      .text(
        WIDTH / 2,
        70,
        factory.task ? `${factory.task} - ${factory.ammoType} ` : "[NO TASK]",
        TEXT_STYLE
      )
      .setOrigin(0.5);

    this.ammoStock = scene.add.text(
      PADDING,
      this.textTask.y + PADDING,
      `STOCK: 0`,
      TEXT_STYLE
    );

    this.productionText = scene.add.text(
      PADDING,
      this.ammoStock.y + PADDING,
      `PRODUCTION: 0/min`,
      TEXT_STYLE
    );

    const progressBarBg = scene.add
      .rectangle(
        PADDING,
        this.productionText.y + PADDING,
        204,
        20,
        colors.overlay.number
      )
      .setOrigin(0);
    this.progressBar = scene.add
      .rectangle(
        progressBarBg.x + 2,
        progressBarBg.y + 2,
        0,
        16,
        colors.backgroundAccent.number
      )
      .setOrigin(0);

    this.factory.events.on("activeWorkerChange", this.updateProd, this);
    this.factory.events.on("taskChanged", this.updateInfo, this);

    this.factory.events.on("cdTick", this.updateProgressBar, this);

    this.container.add([
      scene.add.rectangle(
        WIDTH / 2,
        FACTORY_UI_HEIGHT / 2,
        WIDTH,
        FACTORY_UI_HEIGHT,
        colors.overlay.number
      ),
      scene.add.rectangle(
        WIDTH / 2,
        FACTORY_UI_HEIGHT / 2,
        WIDTH - BORDER * 2,
        FACTORY_UI_HEIGHT - BORDER * 2,
        0xdfd6c5
      ),
      scene.add.rectangle(0, 0, WIDTH, 40, colors.overlay.number).setOrigin(0),
      scene.add
        .text(10, 10, "FACTORY ", {
          fontSize: "24px",
        })
        .setOrigin(0),
      this.productionText,
      this.textTask,
      progressBarBg,

      this.progressBar,
      this.ammoStock,
    ]);

    Effects.addScanlineOverlay(this.scene, {
      height: 720,
      width: 350,
      posX: 1450,
      posY: 340,
    });
  }

  updateProd() {
    this.productionText.setText(
      `PRODUCTION: ${
        (60 / this.factory.productionRate) *
        this.factory.productionPerCycle *
        this.factory.activeWorkers
      }/min`
    );
  }

  updateInfo() {
    this.warehouse.events.removeListener(
      this.currentEvent,
      this.updateAmmoStock
    );

    this.textTask.setText(
      this.factory.task
        ? `${this.factory.task.toLocaleUpperCase()} - ${
            this.factory.ammoType?.toLocaleUpperCase() ?? ""
          }`
        : "[NO TASK]"
    );
    this.currentEvent = `${this.factory.task}.${this.factory.ammoType}`;

    this.warehouse.events.on(
      `${this.factory.task}.${this.factory.ammoType}`,
      this.updateAmmoStock,
      this
    );

    this.updateProd();

    if (
      !this.factory.task ||
      !this.factory.ammoType ||
      this.factory.task === "repair"
    )
      return;

    this.updateAmmoStock(
      this.warehouse.getAmmoCount(this.factory.task, this.factory.ammoType)
    );
  }

  updateAmmoStock(count: number) {
    this.ammoStock.setText(`STOCK: ${count.toString()}`);
  }

  updateProgressBar(percent: number) {
    this.progressBar.width =
      Math.floor(Phaser.Math.Clamp(1 - percent, 0, 1) * 100) * 2;
  }
}
