import { GRAVITY } from "./helpers/config";
import { Game as MainGame } from "./scenes/Game";
import { GameUi } from "./scenes/GameUi";
import { Preloader } from "./scenes/Preloader";

import { Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game-container",
  backgroundColor: "#ffffff",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preloader, GameUi, MainGame],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY, x: 0 },
      debug: true,
    },
  },
};

export default new Game(config);
