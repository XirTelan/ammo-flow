import { Scene } from "phaser";
import { Game } from "./Game";
import { TurretUI } from "../entities/Turrets/ui/TurretUI";
import { formatTime } from "../helpers/utils";
import { MapUI } from "../entities/Player/ControlPanel/ui/MapUI";
import { EnemiesIntel } from "../entities/Enemy/ui/EnemiesIntel";
import { FactoriesPanel } from "../entities/Player/Factories/ui/FactoriesPanel";
import { colors } from "../helpers/config";

export class GameUi extends Scene {
  gameScene: Game;

  constructor() {
    super("GameUi");
  }
  create() {
    this.gameScene = this.scene.get("Game") as Game;
    this.gameScene.events.on(
      "gameReady",
      () => {
        this.initialLoad();
      },
      this
    );
  }

  private drawUi() {
    //pannels l r

    this.add.rectangle(0, 0, 450, 1080, 0xc7b89a, 1).setOrigin(0);
    this.add.rectangle(1470, 0, 450, 1080, 0xc7b89a, 1).setOrigin(0);

    this.add.rectangle(445, 0, 10, 1080, 0x8a8372, 1).setOrigin(0);
    this.add.rectangle(1465, 0, 10, 1080, 0x8a8372, 1).setOrigin(0);
    this.add.rectangle(450, 0, 1050, 30, 0x8a8372, 1).setOrigin(0);
    this.add.rectangle(450, 1050, 1050, 30, 0x8a8372, 1).setOrigin(0);

    this.add.rectangle(700, 0, 100, 70, 0x6d6a59, 1).setOrigin(0);
    const waveCounter = this.add.text(720, 15, "WAVE\n1", {
      color: "#ECE3C6",
      fontSize: "24px",
      fontStyle: "bold",
      align: "center",
    });
    this.gameScene.controlPanel.events.on("waveStart", (value: number) => {
      waveCounter.setText(`WAVE\n${value}`);
    });

    this.add.rectangle(960, 35, 140, 70, 0x6d6a59, 1);
    const timer = this.add
      .text(960, 35, "TIMER\n00 : 00", {
        color: "#ECE3C6",
        fontSize: "24px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
    this.gameScene.controlPanel.events.on("timerUpdate", (value: number) => {
      timer.setText(`TIMER\n${formatTime(value)}`);
    });

    //rigth part
    this.add.rectangle(1475, 0, 450, 70, 0x6d6a59, 1).setOrigin(0);
    this.add
      .text(1550, 35, "BASE HP:", {
        color: "#ECE3C6",
        fontSize: "24px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);
    this.add.rectangle(1610, 35, 300, 20, 0xe6e8ec, 1).setOrigin(0, 0.5);
    // this.add.image(1575, 0, "ui").setOrigin(0);

    //dummy btns
    this.add
      .rectangle(1475, 300, 500, 800, colors.overlay.number, 1)
      .setOrigin(0);

    //time controll
    const stop = this.add.rectangle(1100, 0, 30, 30, 0x6d6a59, 1).setOrigin(0);
    const slow = this.add.rectangle(1140, 0, 30, 30, 0x6d6a59, 1).setOrigin(0);
    const normal = this.add
      .rectangle(1180, 0, 30, 30, 0x6d6a59, 1)
      .setOrigin(0);
    const speed = this.add.rectangle(1220, 0, 30, 30, 0x6d6a59, 1).setOrigin(0);
    stop.setInteractive().on("pointerup", () => {
      if (this.gameScene.scene.isPaused()) {
        this.gameScene.scene.resume();
      } else {
        this.gameScene.scene.pause();
      }
    });
    slow.setInteractive().on("pointerup", () => {
      this.gameScene.physics.world.timeScale = 2;
      this.gameScene.time.timeScale = 1;
    });
    normal.setInteractive().on("pointerup", () => {
      this.gameScene.physics.world.timeScale = 1;
      this.gameScene.time.timeScale = 1;
    });
    speed.setInteractive().on("pointerup", () => {
      this.gameScene.physics.world.timeScale = 0.5;
      this.gameScene.time.timeScale = 2;
    });
  }

  private initialLoad() {
    this.scene.bringToTop();
    this.drawUi();

    const { turrets, factories } = this.gameScene.controlPanel;
    const len = turrets.length;
    for (let i = 0; i < len; i++) {
      new TurretUI(this, 10, 10 + 115 * i, turrets[i]);
    }

    new MapUI(this, this.gameScene);
    new EnemiesIntel(this, this.gameScene.commander);
    new FactoriesPanel(this, factories);
  }

  addTurretPanel() {}
}
