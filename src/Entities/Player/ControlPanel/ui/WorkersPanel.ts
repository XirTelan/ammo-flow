import { Scene } from "phaser";
import { ControlPanel } from "../ControlPanel";
import { colors } from "@/helpers/config";

const WIDTH = 100;
const HEIGHT = 300;

const NUMBERTEXT_STYLE = {
  fontSize: "48px",
  fontStyle: "bold",
};

export class WorkersPanel {
  scene: Scene;
  controlPanel: ControlPanel;
  container: Phaser.GameObjects.Container;
  totalWorkers: Phaser.GameObjects.Text;
  availableWorkers: Phaser.GameObjects.Text;
  constructor(scene: Scene, x: number, y: number, controlPanel: ControlPanel) {
    this.scene = scene;
    this.controlPanel = controlPanel;

    this.container = this.scene.add.container(x, y);

    this.totalWorkers = this.scene.add.text(
      20,
      100,
      controlPanel.workers.toString().padStart(2, "0"),
      NUMBERTEXT_STYLE
    );
    this.availableWorkers = this.scene.add.text(
      20,
      200,
      controlPanel.workersAvailable.toString().padStart(2, "0"),
      NUMBERTEXT_STYLE
    );
    this.controlPanel.events.on(
      "totalWorkersChange",
      this.updateTotalWorkers,
      this
    );
    this.controlPanel.events.on(
      "activeWorkersChange",
      this.updateActiveWorkers,
      this
    );
    this.controlPanel.events.on("", this.updateTotalWorkers, this);

    this.container.add([
      this.scene.add
        .rectangle(0, 0, WIDTH, HEIGHT, colors.overlay.number)
        .setOrigin(0),
      this.scene.add
        .rectangle(0, 60, 100, 40, colors.backgroundAccent.number)
        .setOrigin(0),

      this.scene.add
        .rectangle(0, 150, 100, 40, colors.backgroundAccent.number)
        .setOrigin(0),
      this.scene.add.text(20, 70, "TOTAL", {
        fontSize: "24px",
        color: "#000",
        fontStyle: "bold",
      }),
      this.scene.add.text(10, 100, "AVAILABE", {
        fontSize: "18px",
        color: "#000",
        fontStyle: "bold",
      }),
      this.totalWorkers,
      this.availableWorkers,
    ]);
  }

  updateActiveWorkers(count: number) {
    this.availableWorkers.setText(count.toString().padStart(2, "0"));
  }
  updateTotalWorkers(count: number) {
    this.totalWorkers.setText(count.toString().padStart(2, "0"));
  }
}
