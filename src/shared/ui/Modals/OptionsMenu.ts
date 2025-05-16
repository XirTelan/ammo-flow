import { AudioManager } from "@/entities/general/AudioManager";
import { VolumeControl } from "@/entities/general/VolumeControl";
import { ModalContainer } from "./Modal";
import { TaskButton } from "@/entities/Player/Factories/ui/FactoryTasks/TaskButton";

const OPTIONS_XOFFSET = 200;
const OPTIONS_YOFFSET = 200;
export class OptionsMenu extends ModalContainer {
  private audioManager = AudioManager.getInstance();
  private controls: VolumeControl[] = [];

  constructor(scene: Phaser.Scene, x = 0, y = 0, onClose?: () => void) {
    super(scene, x, y, onClose);
    this.createUI();
  }

  private createUI(): void {
    const { width, height } = this.scene.scale;

    const content = this.scene.add.container(
      width / 2 - OPTIONS_XOFFSET,
      height / 2 - OPTIONS_YOFFSET
    );
    content.add(
      this.scene.add
        .text(OPTIONS_XOFFSET, 20, "Options", {
          fontSize: "28px",
          fontFamily: "Lucida Console, monospace",
          color: "#ffffff",
        })
        .setOrigin(0.5)
    );
    const master = new VolumeControl(
      this.scene,
      40,
      60,
      "Master",
      "master",
      this.audioManager
    );
    const bgm = new VolumeControl(
      this.scene,
      40,
      130,
      "BGM",
      "bgm",
      this.audioManager
    );
    const sfx = new VolumeControl(
      this.scene,
      40,
      200,
      "SFX",
      "sfx",
      this.audioManager
    );

    this.controls.push(master, bgm, sfx);

    const resetBtn = new TaskButton({
      x: 200,
      y: 300,
      width: 250,
      height: 50,
      scene: this.scene,
      title: "Reset to Defaults",
      action: () => this.controls.forEach((c) => c.reset()),
      borderThickness: 2,
    });

    const closeBtn = new TaskButton({
      x: 200,
      y: 380,
      width: 250,
      height: 50,
      scene: this.scene,
      title: "Close",
      action: this.hide.bind(this),
      borderThickness: 2,
    });

    content.add([master, bgm, sfx, resetBtn.container, closeBtn.container]);
    this.add(content);
  }

  show() {
    this.setVisible(true);
  }
  hide() {
    this.onCloseAction?.();

    this.setVisible(false);
  }
}
