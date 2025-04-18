import { Scene } from "phaser";

export class GameUi extends Scene {
  constructor() {
    super("GameUi");
  }
  create() {
    this.events.emit("ui-ready");
    this.scene.bringToTop();

    //pannels l r
    this.add.rectangle(0, 0, 450, 1080, 0xc7b89a, 1).setOrigin(0);
    this.add.rectangle(1470, 0, 450, 1080, 0xc7b89a, 1).setOrigin(0);

    for (let i = 0; i < 8; i++) {
      this.createBlock(this, 20, -50 + 110 * i);
    }
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

  createBlock(scene: Scene, x: number, y: number) {
    const container = scene.add.container(x, y);
    container.add([
      this.add.rectangle(0, 55, 400, 40, 0xe6e8ec, 1).setOrigin(0),
      this.add.rectangle(0, 75, 400, 5, 0x8a8372, 1).setOrigin(0),
      this.add.rectangle(0, 80, 400, 80, 0x6d6a59, 1).setOrigin(0),
      this.add.rectangle(0, 155, 400, 5, 0x8a8372, 1).setOrigin(0),
      this.add.image(90, 90, "artillery_ui").setOrigin(0).setScale(0.6),
      this.add.rectangle(240, 125, 90, 30, 0xe6e8ec, 1).setOrigin(0),
      this.add.text(0, 55, " 1 Artillery                Lv: 2", {
        color: "#2C2C2C",
        fontSize: "20px",
        fontStyle: "bold",
      }),

      this.add.text(250, 85, "AMMO\n30/150", {
        color: "#ECE3C6",
        fontSize: "20px",
        fontStyle: "bold",
        align: "center",
      }),

      this.add.text(250, 130, "FIRING", {
        color: "#2C2C2C",
        fontSize: "20px",
        fontStyle: "bold",
      }),
      this.add.rectangle(0, 75, 70, 85, 0x000000, 1).setOrigin(0),
      this.add.rectangle(330, 75, 70, 85, 0x000000, 1).setOrigin(0),
    ]);
  }
}
