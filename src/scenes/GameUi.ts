import { Scene } from "phaser";
import { Game } from "./Game";
import { Turret } from "../Entities/Towers/Turret";
import { TurretUI } from "../ui/ui-ingame/TurretUI";

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
        console.log("asd", this.gameScene);
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

    this.add.text(1200, 65, "ZOOM: 100 %", {
      color: "#ECE3C6",
      fontSize: "32px",
      fontStyle: "bold",
      align: "center",
    });

    this.add.rectangle(700, 0, 100, 70, 0x6d6a59, 1).setOrigin(0);
    this.add.text(720, 15, "WAVE\n1", {
      color: "#ECE3C6",
      fontSize: "24px",
      fontStyle: "bold",
      align: "center",
    });
    this.add.rectangle(960, 35, 140, 70, 0x6d6a59, 1);
    this.add
      .text(960, 35, "TIMER\n00 : 00", {
        color: "#ECE3C6",
        fontSize: "24px",
        fontStyle: "bold",
        align: "center",
      })
      .setOrigin(0.5);

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
    this.add.rectangle(1475, 400, 120, 40, 0x6d6a59, 1).setOrigin(0);
    this.add.rectangle(1475, 450, 120, 40, 0x6d6a59, 1).setOrigin(0);
    this.add.rectangle(1475, 500, 120, 40, 0x6d6a59, 1).setOrigin(0);
    this.add.rectangle(1475, 550, 120, 40, 0x6d6a59, 1).setOrigin(0);

    this.add.rectangle(1600, 400, 120, 40, 0x6d6a59, 1).setOrigin(0);
    this.add.rectangle(1600, 450, 120, 40, 0x6d6a59, 1).setOrigin(0);
    this.add.rectangle(1600, 500, 120, 40, 0x6d6a59, 1).setOrigin(0);
    this.add.rectangle(1600, 550, 120, 40, 0x6d6a59, 1).setOrigin(0);
    this.add.rectangle(1475, 600, 500, 500, 0x6d6a59, 1).setOrigin(0);
  }

  private initialLoad() {
    this.scene.bringToTop();
    this.drawUi();
    console.log("asd", this.gameScene);
    const { turrets } = this.gameScene.controlPanel;
    const len = turrets.length;
    for (let i = 0; i < len; i++) {
      new TurretUI(this, 20, 110 * i, turrets[i]);
    }
  }

  addTurretPanel() {}
}
