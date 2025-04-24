import { Scene } from "phaser";
import { Game } from "./Game";
import { TurretUI } from "../entities/Turrets/ui/TurretUI";
import { formatTime } from "../helpers/utils";
import { MapUI } from "../entities/Player/ControlPanel/ui/MapUI";
import { EnemiesIntel } from "../entities/Enemy/ui/EnemiesIntel";
import { FactoriesPanel } from "../entities/Player/Factories/ui/FactoriesPanel";
import { colors } from "../helpers/config";
import { WarehouseUI } from "@/entities/Player/Warehouse/ui/WarehouseUi";
import { BaseButton } from "@/shared/ui/BaseButton";
import { WorkersPanel } from "@/entities/Player/ControlPanel/ui/WorkersPanel";

export class GameUi extends Scene {
  gameScene: Game;

  timeBtns: BaseButton[] = [];

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

    this.add.rectangle(0, 0, 450, 1080, 0x000000, 1).setOrigin(0);
    this.add.rectangle(1470, 0, 450, 1080, 0x000000, 1).setOrigin(0);

    this.add.rectangle(445, 0, 10, 1080, 0x8a8372, 1).setOrigin(0);
    this.add.rectangle(1465, 0, 10, 1080, 0x8a8372, 1).setOrigin(0);

    //WAVE COUNTER

    this.add.rectangle(1660, 0, 100, 70, 0x6d6a59, 1).setOrigin(0);
    const waveCounter = this.add.text(1680, 30, "000", {
      color: "#ECE3C6",
      fontSize: "24px",
      fontStyle: "bold",
      align: "center",
    });
    this.gameScene.controlPanel.events.on("waveStart", (value: number) => {
      waveCounter.setText(`${String(value).padStart(3, "0")}`);
    });

    this.add.image(1530, 30, "controlPanel_time");

    this.add.rectangle(1800, 35, 100, 70, 0x6d6a59, 1);
    const timer = this.add
      .text(1800, 40, "00 : 00", {
        color: "#ECE3C6",
        fontSize: "20px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

    this.add.image(1760, 35, "controlPanel_timer");

    this.gameScene.controlPanel.events.on("timerUpdate", (value: number) => {
      timer.setText(`${formatTime(value)}`);
    });

    this.initTimeSpeedBtns();
  }

  private initialLoad() {
    this.scene.bringToTop();
    this.drawUi();

    const { turrets, factories } = this.gameScene.controlPanel;
    const len = turrets.length;
    for (let i = 0; i < len; i++) {
      new TurretUI(this, 0, 0 + 141 * i, turrets[i]);
    }

    new MapUI(this, this.gameScene);

    this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 5,
      "mainScreen"
    );

    const hpBarBg = this.add
      .rectangle(480, 40, 254, 29, colors.overlay.number)
      .setOrigin(0);
    this.add
      .rectangle(
        hpBarBg.x + 2,
        hpBarBg.y + 2,
        250,
        25,
        colors.textPrimary.number
      )
      .setOrigin(0);
    this.add
      .text(
        hpBarBg.x + hpBarBg.width / 2,
        hpBarBg.y + hpBarBg.height / 2,
        "100/100",
        {
          color: "#000",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    new EnemiesIntel(this, this.gameScene.commander);

    new WorkersPanel(this, 1810, 750, this.gameScene.controlPanel);
    new FactoriesPanel(this, factories);
    new WarehouseUI(this);

    this.add.image(1695, 170, "infoPanel").setDepth(10);
  }

  addTurretPanel() {}

  initTimeSpeedBtns() {
    const stopBtn = new BaseButton(
      this,
      1498,
      26,
      "pause_normal",
      "pause_over",
      "pause_pressed"
    );
    const slowBtn = new BaseButton(
      this,
      1540,
      26,
      "speed_slow",
      "speed_slow_over",
      "speed_slow_pressed"
    );
    const normalBtn = new BaseButton(
      this,
      1585,
      26,
      "speed_normal",
      "speed_normal_over",
      "speed_normal_pressed"
    );
    normalBtn.toggle();
    const fastBtn = new BaseButton(
      this,
      1630,
      26,
      "speed_fast",
      "speed_fast_over",
      "speed_fast_pressed"
    );

    stopBtn.baseImage.on("pointerup", () => {
      if (this.gameScene.scene.isPaused()) {
        this.gameScene.scene.resume();
      } else {
        this.gameScene.scene.pause();
      }
      stopBtn.toggle();
    });
    slowBtn.baseImage.on("pointerup", () => {
      this.clickTimeBtn(slowBtn, 2, 0.5);
    });
    normalBtn.baseImage.on("pointerup", () => {
      this.clickTimeBtn(normalBtn, 1, 1);
    });
    fastBtn.baseImage.on("pointerup", () => {
      this.clickTimeBtn(fastBtn, 0.5, 2);
    });
    this.timeBtns.push(stopBtn, slowBtn, normalBtn, fastBtn);
  }

  disableAllBtns() {
    this.timeBtns.forEach((btn) => {
      btn.setActive(false);
    });
  }

  clickTimeBtn(btn: BaseButton, physScale: number, timeScale: number) {
    if (this.gameScene.scene.isPaused()) {
      this.gameScene.scene.resume();
    }
    this.gameScene.physics.world.timeScale = physScale;
    this.gameScene.time.timeScale = timeScale;
    this.disableAllBtns();
    btn.toggle();
  }
}
