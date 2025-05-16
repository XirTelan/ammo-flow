import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";
import { helpDb } from "../../model/constants";
import { ModalContainer } from "./Modal";

interface Topic {
  title: string;
  content: string;
  imageKey?: string;
}

export class DatabaseModal extends ModalContainer {
  private topicsData: Topic[];
  private contentText: Phaser.GameObjects.Text;
  private topicImage?: Phaser.GameObjects.Image;

  constructor(scene: Phaser.Scene, onClose?: () => void) {
    super(scene, 0, 0, onClose);
    this.scene = scene;
    this.topicsData = helpDb;

    const width = scene.scale.width;
    const height = scene.scale.height;

    this.createUI(width);
  }

  private createUI(width: number) {
    const listX = 130;
    const listY = 40;
    const listWidth = 200;

    const topicList = this.scene.add.container(200, 100);
    let offsetY = 0;
    this.topicsData.forEach((topic, index) => {
      const btn = new TaskButton({
        scene: this.scene,
        y: offsetY,
        width: 250,
        height: 50,
        title: topic.title,
        action: () => this.showTopic(index),
      });
      topicList.add(btn.container);
      offsetY += 60;
    });
    const closeBtn = new TaskButton({
      scene: this.scene,
      y: offsetY * 2,
      width: 250,
      height: 50,
      title: "CLOSE",
      action: () => this.hide(),
    });
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
      .image(width / 2, 850, "")
      .setVisible(false)
      .setOrigin(0.5)
      .setScale(0.8);
    this.add(this.topicImage);
    this.showTopic(0);
  }

  private showTopic(index: number) {
    const topic = this.topicsData[index];
    this.contentText.setText(topic.content);

    if (topic.imageKey) {
      this.topicImage?.setTexture(topic.imageKey).setVisible(true);
    } else {
      this.topicImage?.setVisible(false);
    }
  }
}
