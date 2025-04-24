import { Scene } from "phaser";
import { Game } from "../../../../scenes/Game";
import { colors } from "../../../../helpers/config";

const startPoing = 140;

export class MapUI {
  uiScene: Scene;
  gameScene: Game;

  zoomMarker: Phaser.GameObjects.Triangle;
  zoomValueText: Phaser.GameObjects.Text;

  startPointer: Phaser.Types.Math.Vector2Like;
  startScroll: Phaser.Types.Math.Vector2Like;

  constructor(scene: Scene, gameScene: Game) {
    this.uiScene = scene;
    this.gameScene = gameScene;

    this.zoomValueText = scene.add.text(1230, 45, "ZOOM: 100%", {
      color: colors.textPrimary.hex,
      fontSize: "32px",
      fontStyle: "bold",
      align: "center",
      stroke: "#444",
      strokeThickness: 4,
    });

    scene.add.rectangle(1450, 90, 5, 100, colors.textPrimary.number);

    this.zoomMarker = scene.add
      .triangle(
        1430,
        startPoing - 50,
        0,
        -10,
        15,
        0,
        0,
        10,
        colors.textPrimary.number
      )
      .setOrigin(0);

    this.mapMovment();
  }
  private mapZoom(value: number) {
    const percent = Phaser.Math.Percent(value, 0.5, 1.5);
    const output = Phaser.Math.Linear(50, 150, percent);
    this.zoomValueText.setText(`ZOOM: ${Math.floor(output)}%`);
    this.uiScene.tweens.add({
      targets: this.zoomMarker,
      y: startPoing - percent * 100,
      duration: 100,
    });
  }
  private isOutBound(x: number, y: number) {
    return x < 450 || x > 1450 || y < 50 || y > 1050;
  }

  private mapMovment() {
    const uiScene = this.uiScene;
    const mapCam = this.gameScene.cameras.main;

    uiScene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.isOutBound(pointer.x, pointer.y)) return;
      this.startPointer = { x: pointer.x, y: pointer.y };
      this.startScroll = { x: mapCam.scrollX, y: mapCam.scrollY };
    });

    uiScene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isOutBound(pointer.x, pointer.y)) return;
      if (pointer.isDown && this.startPointer) {
        const dx = pointer.x - this.startPointer.x;
        const dy = pointer.y - this.startPointer.y;
        mapCam.scrollX = this.startScroll.x - dx / mapCam.zoom;
        mapCam.scrollY = this.startScroll.y - dy / mapCam.zoom;
      }
    });
    uiScene.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        _gameObjects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number
      ) => {
        if (this.isOutBound(pointer.x, pointer.y)) return;
        const zoomFactor = 0.002;
        mapCam.zoom = Phaser.Math.Clamp(
          mapCam.zoom - deltaY * zoomFactor,
          0.5,
          1.5
        );
        this.mapZoom(mapCam.zoom);
      }
    );
  }
}
