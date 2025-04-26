import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";
import { DatabaseModal } from "./Modals/Database";
import { Scene } from "phaser";
import { colors } from "@/helpers/config";
import { Effects } from "../Effects";
import { OptionsMenu } from "./Modals/OptionsMenu";

interface MainMenuOption {
  title: string;
  action: () => void;
}

export class MainMenuUi {
  private scene: Scene;
  private container: Phaser.GameObjects.Container;
  private menuOptions: MainMenuOption[];
  private statusTexts: Phaser.GameObjects.Text[] = [];
  private timeText: Phaser.GameObjects.Text;
  private infoModal: DatabaseModal;

  private optionsModal: OptionsMenu;

  constructor(scene: Scene) {
    this.container = scene.add.container();
    this.scene = scene;

    this.menuOptions = [
      { title: "New Game", action: () => this.startNewGame() },
      { title: "How to play", action: () => this.showDataBase() },
      { title: "Options", action: () => this.openOptions() },
    ];

    const width = scene.scale.width;
    const height = scene.scale.height;

    const background = scene.add
      .rectangle(0, 0, width, height, colors.overlay.number, 1)
      .setOrigin(0)
      .setInteractive();

    this.container.add(background);

    this.createUI(width, height);
    this.infoModal = new DatabaseModal(scene);
    this.optionsModal = new OptionsMenu(scene);

    Effects.addScanlineOverlay(this.scene);
    Effects.createVerticalDataStream(this.scene, 8);
    Effects.createPulseShimmer(this.scene, width, height, 10);
  }

  private createUI(width: number, height: number): void {
    const menuWidth = 300;
    const menuHeight = this.menuOptions.length * 60;
    const centerX = (width - menuWidth) / 2;
    const centerY = (height - menuHeight) / 2;

    const menuList = this.scene.add.container(centerX, centerY);
    let offsetY = 0;
    this.menuOptions.forEach((option) => {
      const btn = new TaskButton(
        this.scene,
        offsetY,
        option.title,
        option.action,
        false,
        300
      );
      menuList.add(btn.container);
      offsetY += 60;
    });

    this.container.add(menuList);

    const statusStyle: Phaser.Types.GameObjects.Text.TextStyle = {
      fontSize: "16px",
      fontFamily: "Lucida Console, monospace",
      color: colors.textPrimary.hex,
      wordWrap: { width: 200 },
    };

    const statuses = [
      { x: 20, y: 20, text: "SYSTEM: ONLINE" },
      { x: width - 220, y: 20, text: "USER: COMMANDER" },
      { x: 20, y: height - 40, text: "BUILD: v0.0.0-GameDevJs" },
      { x: width - 220, y: height - 40, text: "TIME: 00:00" },
    ];

    statuses.forEach((info) => {
      const statusText = this.scene.add.text(
        info.x,
        info.y,
        info.text,
        statusStyle
      );
      statusText.setInteractive();
      Effects.addPulseEffect(this.scene, statusText);
      this.statusTexts.push(statusText);
      this.container.add(statusText);

      if (info.text.startsWith("TIME")) {
        this.timeText = statusText;
      }
    });

    this.updateTime();
  }

  private updateTime(): void {
    this.scene.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.timeText.setText(this.getCurrentTime());
      },
    });
  }

  getCurrentTime() {
    const currentTime = new Date();
    const hours = currentTime.getHours().toString().padStart(2, "0");
    const minutes = currentTime.getMinutes().toString().padStart(2, "0");
    const seconds = currentTime.getSeconds().toString().padStart(2, "0");
    return `TIME: ${hours}:${minutes}:${seconds}`;
  }

  private startNewGame() {
    this.scene.scene.start("Game");
  }

  private showDataBase() {
    this.infoModal.show();
  }

  private openOptions() {
    this.optionsModal.show();
  }
}
