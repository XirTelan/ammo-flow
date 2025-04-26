import { BaseButton } from "@/shared/ui/BaseButton";
import { Scene } from "phaser";
import { FactoriesPanel } from "./FactoriesPanel";
import { Factory } from "../Factory";
import { colors } from "@/helpers/config";

export class FactoryControl {
  scene: Scene;
  factory: Factory;
  factoryPanel: FactoriesPanel;
  container: Phaser.GameObjects.Container;

  constructor(
    scene: Scene,
    x: number,
    y: number,
    factoryPanel: FactoriesPanel,
    factory: Factory
  ) {
    this.scene = scene;
    this.factoryPanel = factoryPanel;
    this.factory = factory;
    this.container = this.scene.add.container(x, y);

    const workersBg = this.scene.add
      .rectangle(-50, -50, 100, 100, colors.backgroundAccent.number)
      .setOrigin(0);

    const workerCount = scene.add
      .text(0, -10, `${factory.activeWorkers}`, {
        fontSize: "24px",
        color: "#444",
        fontStyle: "bold",
        fontFamily: "monospace",
      })
      .setOrigin(0.5);

    factory.events.on("activeWorkerChange", (value: number) => {
      workerCount.setText(value.toString());
    });

    this.container.add([workersBg, workerCount]);

    this.drawControlPanel();
    this.drawButtons();
  }

  drawControlPanel() {
    this.container.add(this.scene.add.image(0, 0, "factoryUi"));
  }
  drawButtons() {
    const addWorkerBtn = new BaseButton(
      this.scene,
      31,
      -10,
      "addWorker",
      "addWorker_over",
      "addWorker_pressed"
    );
    const removeWorkerBtn = new BaseButton(
      this.scene,
      -31,
      -10,
      "removeWorker",
      "removeWorker_over",
      "removeWorker_pressed"
    );
    const changeTaskBtn = new BaseButton(
      this.scene,
      0,
      27,
      "changeTask",
      "changeTask_over",
      "changeTask_pressed"
    );

    addWorkerBtn.baseImage.on("pointerup", () => {
      this.factory.addWorker(1);
    });
    removeWorkerBtn.baseImage.on("pointerup", () => {
      this.factory.removeWorker(1);
    });

    changeTaskBtn.baseImage.on("pointerup", this.changeTask, this);
    this.container.add([
      addWorkerBtn.container,
      removeWorkerBtn.container,
      changeTaskBtn.container,
    ]);
    this.container.setDepth(11);
  }

  changeTask() {
    this.factoryPanel.changeTask(this.factory);
  }
}
