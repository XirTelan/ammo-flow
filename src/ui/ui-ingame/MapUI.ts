import { Scene } from "phaser";
import { Game } from "../../scenes/Game";

export class MapUI {
  constructor(scene: Scene, gameScene: Game) {
    const mapZoom = scene.add.text(1200, 65, "ZOOM: 100%", {
      color: "#ECE3C6",
      fontSize: "32px",
      fontStyle: "bold",
      align: "center",
    });

    gameScene.events.on("mapZoom", (value: number) => {
      const percent = Phaser.Math.Percent(value, 0.5, 2);
      const output = Phaser.Math.Linear(50, 200, percent);
      mapZoom.setText(`ZOOM: ${Math.floor(output)}%`);
    });
  }
}
