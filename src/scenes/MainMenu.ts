import { colors } from "@/helpers/config";
import { MainMenuUi } from "@/shared/ui/MainMenuUi";
import { Scene, GameObjects } from "phaser";

export class MainMenu extends Scene {
  background: GameObjects.Image;
  logo: GameObjects.Image;
  title: GameObjects.Text;

  constructor() {
    super("MainMenu");
  }

  loadSetings() {
    const volume = Number(localStorage.getItem("volume"));
    this.game.sound.setVolume((volume ?? 100) / 100);
  }

  create() {
    this.loadSetings();

    new MainMenuUi(this);

    const width = this.cameras.main.width;
    const textContent = [
      "[SYS]: Booting up...",
      "[SYS]: Initializing system components...",
      "[SYS]: Network connection established.",
      "[SYS]: Security protocols active.",
      "[USER]: Welcome, Commander.",
      "[SYS]: Loading primary data...",
      "[SYS]: Status: All systems operational.",
      "[SYS]: Scanning for available missions...",
      "[USER]: Command center online.",
      "[SYS]: Data stream 001 active.",
      "[USER]: Ready for input.",
      "[SYS]: Download complete: 100%",
      "[SYS]: Encryption sequence engaged.",
      "[USER]: Awaiting next command...",
      "[SYS]: Time synchronization complete.",
      "[SYS]: Running diagnostics...",
      "[USER]: Diagnostics clear.",
      "[SYS]: Preparing for launch...",
      "[SYS]: Standby for further instructions...",
      "[USER]: System check complete. Ready for action.",
      "[SYS]: Awaiting further orders.",
    ];

    const startX = 10;
    let startY = 50;

    textContent.forEach((line, index) => {
      this.time.delayedCall(index * 500, () => {
        const text = this.add
          .text(startX, startY, line, {
            fontSize: "18px",
            fontFamily: "Lucida Console, monospace",
            color: colors.textSecondary.hex,
            wordWrap: { width: width - 50 },
          })
          .setAlpha(0);

        startY += 30;

        this.tweens.add({
          targets: text,
          alpha: 1,
          duration: 500,
          ease: "Sine.easeIn",
        });
      });
    });
  }
}
