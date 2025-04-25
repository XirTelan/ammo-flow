import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";
import { helpDb } from "../model/constants";

interface Topic {
  title: string;
  content: string;
  imageKey?: string;
}

export class DatabaseModal extends Phaser.GameObjects.Container {
  private background: Phaser.GameObjects.Rectangle;
  private topicsData: Topic[];
  private contentText: Phaser.GameObjects.Text;
  private topicImage?: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0);

    this.scene = scene;
    this.topicsData = helpDb;

    const width = scene.scale.width;
    const height = scene.scale.height;

    this.setSize(width, height);
    this.setInteractive(
      new Phaser.Geom.Rectangle(0, 0, width, height),
      Phaser.Geom.Rectangle.Contains
    );

    this.background = scene.add
      .rectangle(0, 0, width, height, 0x000000, 0.8)
      .setOrigin(0)
      .setInteractive();

    this.add(this.background);

    this.createUI(width);
    this.setDepth(20);
    this.setVisible(false);
    scene.add.existing(this);
  }

  private createUI(width: number): void {
    const listX = 40;
    const listY = 40;
    const listWidth = 200;

    const topicList = this.scene.add.container(0, 0);
    let offsetY = 0;
    this.topicsData.forEach((topic, index) => {
      const btn = new TaskButton(
        this.scene,
        offsetY,
        topic.title,
        () => this.showTopic(index),
        false
      );

      topicList.add(btn.container);
      offsetY += 45;
    });
    const closeBtn = new TaskButton(
      this.scene,
      offsetY * 2,
      "CLOSE",
      () => this.hide(),
      false
    );
    topicList.add(closeBtn.container);

    const contentX = listX + listWidth + 40;
    const contentWidth = width - contentX - 40;

    this.contentText = this.scene.add.text(contentX, listY, "", {
      fontSize: "28px",
      fontFamily: "Lucida Console, monospace",
      color: "#ffffff",
      wordWrap: { width: contentWidth },
    });

    this.add([topicList, this.contentText]);

    this.topicImage = this.scene.add
      .image(width / 2, 700, "")
      .setVisible(false)
      .setOrigin(0.5);
    this.add(this.topicImage);
    this.showTopic(0);
  }

  private showTopic(index: number): void {
    const topic = this.topicsData[index];
    this.contentText.setText(topic.content);

    if (topic.imageKey) {
      this.topicImage?.setTexture(topic.imageKey).setVisible(true);
    } else {
      this.topicImage?.setVisible(false);
    }
  }

  public show(): void {
    this.setVisible(true);
  }

  public hide(): void {
    this.setVisible(false);
  }
}
