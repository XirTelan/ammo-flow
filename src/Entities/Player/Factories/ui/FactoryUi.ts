import { Scene } from "phaser";
import { Factory } from "../Factory";
import { colors } from "@/helpers/config";
const WIDTH = 360;
const HEIGHT = 150;
const BORDER = 5;

export class FactoryUi {
  scene: Scene;
  container: Phaser.GameObjects.Container;
  controlsContainer: Phaser.GameObjects.Container;
  factory: Factory;
  constructor(scene: Scene, x: number, y: number, factory: Factory) {
    this.factory = factory;
    this.scene = scene;

    this.container = scene.add.container(x, y);

    const textTask = scene.add
      .text(
        WIDTH / 2,
        70,
        factory.task ? `${factory.task} - ${factory.ammoType} ` : "[NO TASK]",
        {
          fontSize: "24px",
          color: "#444",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.factory.events.on("taskChanged", () => {
      textTask.setText(
        factory.task
          ? `${factory.task.toLocaleUpperCase()} - ${factory.ammoType?.toLocaleUpperCase()} `
          : "[NO TASK]"
      );
    });

    this.container.add([
      // scene.add.rectangle(WIDTH / 2, 200, WIDTH, HEIGHT, colors.overlay.number),
      // scene.add.rectangle(
      //   WIDTH / 2,
      //   HEIGHT / 2,
      //   WIDTH,
      //   HEIGHT,
      //   colors.overlay.number
      // ),
      scene.add.rectangle(
        WIDTH / 2,
        HEIGHT / 2,
        WIDTH,
        HEIGHT,
        colors.overlay.number
      ),
      scene.add.rectangle(
        WIDTH / 2,
        HEIGHT / 2,
        WIDTH - BORDER * 2,
        HEIGHT - BORDER * 2,
        0xdfd6c5
      ),
      scene.add.rectangle(0, 0, WIDTH, 40, colors.overlay.number).setOrigin(0),
      scene.add
        .text(10, 10, "FACTORY ", {
          fontSize: "24px",
        })
        .setOrigin(0),
      textTask,
    ]);
  }
}
