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
import { DatabaseModal } from "@/shared/ui/Database";
import { TimeControl } from "@/entities/Player/ControlPanel/ui/TimeControl";

export class GameUi extends Scene {
  gameScene: Game;

  timeBtns: BaseButton[] = [];
  timeControl: TimeControl;

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
    this.createWaveCounter();
    this.createTimer();

    this.timeControl = new TimeControl(this, this.gameScene);
    this.timeControl.init();
  }

  private initialLoad() {
    this.scene.bringToTop();
    this.drawUi();

    this.setupTurrets();
    this.setupMap();
    this.setupMainScreen();
    this.setupHealthBar();
    this.setupEnemiesIntel();
    this.setupPanels();
    this.setupInfoPanel();
    this.setupButtons();
  }
  private createWaveCounter() {
    this.add.rectangle(1660, 0, 100, 70, colors.overlay.number, 1).setOrigin(0);

    const waveCounter = this.add.text(1675, 30, "0.0.0", {
      color: "#fff",
      fontSize: "20px",
      fontStyle: "bold",
      fontFamily: "monospace",
      align: "center",
    });

    this.gameScene.controlPanel.events.on("waveStart", (value: number) => {
      const valueStr = String(value).padStart(3, "0");
      waveCounter.setText(`${valueStr[0]}.${valueStr[1]}.${valueStr[2]}`);
    });

    this.add.image(1530, 29, "controlPanel_time");
  }

  private createTimer() {
    this.add.rectangle(1800, 35, 100, 70, colors.overlay.number, 1);

    const timer = this.add
      .text(1800, 40, "0.0 : 0.0", {
        color: "#fff",
        fontSize: "24px",
        fontStyle: "bold",
        fontFamily: "monospace",
        align: "center",
      })
      .setOrigin(0.5);

    this.add.image(1760, 35, "controlPanel_timer");

    this.gameScene.controlPanel.events.on("timerUpdate", (value: number) => {
      timer.setText(formatTime(value));
    });
  }

  private setupTurrets() {
    const { turrets } = this.gameScene.controlPanel;
    turrets.forEach((turret, i) => {
      new TurretUI(this, 0, 0 + 141 * i, turret);
    });
  }

  private setupMap() {
    new MapUI(this, this.gameScene);
  }

  private setupMainScreen() {
    this.add.image(
      this.cameras.main.width / 2,
      this.cameras.main.height / 2 + 5,
      "mainScreen"
    );
  }

  private setupHealthBar() {
    const healthMax = this.gameScene.controlPanel.healthMax;
    const barWidth = 250;
    const barHeight = 25;

    const hpBarBg = this.add
      .rectangle(480, 40, barWidth + 4, barHeight + 4, colors.overlay.number)
      .setOrigin(0);

    const hpFill = this.add
      .rectangle(
        hpBarBg.x + 2,
        hpBarBg.y + 2,
        barWidth,
        barHeight,
        colors.textPrimary.number
      )
      .setOrigin(0);

    const hpValue = this.add
      .text(
        hpBarBg.x + (barWidth + 4) / 2,
        hpBarBg.y + (barHeight + 4) / 2,
        `${this.gameScene.controlPanel.health}/${healthMax}`,
        {
          color: "#000",
          fontStyle: "bold",
        }
      )
      .setOrigin(0.5);

    this.gameScene.controlPanel.events.on("health", (currentHp: number) => {
      console.log(currentHp);
      const clampedHp = Phaser.Math.Clamp(currentHp, 0, healthMax);
      const fillRatio = clampedHp / healthMax;
      console.log(currentHp);
      hpValue.setText(`${clampedHp}/${healthMax}`);
      hpFill.width = barWidth * fillRatio;
    });
  }

  private setupEnemiesIntel() {
    new EnemiesIntel(this, this.gameScene.commander);
  }

  private setupPanels() {
    const { controlPanel } = this.gameScene;
    new WorkersPanel(this, 1810, 270, controlPanel);
    new FactoriesPanel(this, controlPanel.factories);
    new WarehouseUI(this);
  }

  private setupInfoPanel() {
    this.add.image(1695, 170, "infoPanel").setDepth(10);
  }

  private setupButtons() {
    const mainMenu = new BaseButton(
      this,
      1892,
      45,
      "mainMenu",
      "mainMenu_over",
      "mainMenu_pressed"
    );

    const infoModal = new DatabaseModal(this);
    const database = new BaseButton(
      this,
      140,
      1045,
      "databaseBtn",
      "databaseBtn_over",
      "databaseBtn_pressed"
    );

    database.baseImage.on("pointerup", () => {
      if (!this.gameScene.scene.isPaused()) {
        this.gameScene.scene.pause();
      }
      infoModal.show();
    });
  }

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
