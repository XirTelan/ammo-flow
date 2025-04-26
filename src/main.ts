import { GRAVITY } from "./helpers/config";
import { Game as MainGame } from "./scenes/Game";
import { GameOver } from "./scenes/GameOver";
import { GameUi } from "./scenes/GameUi";
import { MainMenu } from "./scenes/MainMenu";
import { Preloader } from "./scenes/Preloader";

import { Game, Types } from "phaser";

const config: Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  parent: "game-container",
  backgroundColor: "#000000",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [Preloader, MainMenu, MainGame, GameUi, GameOver],
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: GRAVITY, x: 0 },
      debug: false,
    },
  },
};

export default new Game(config);
