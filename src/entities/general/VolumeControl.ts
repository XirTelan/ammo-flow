import { colors } from "@/helpers/config";
import { TaskButton } from "../Player/Factories/ui/FactoryTasks/TaskButton";
import { AudioManager } from "./AudioManager";

type VolumeType = "master" | "bgm" | "sfx";

export class VolumeControl extends Phaser.GameObjects.Container {
  private barFill: Phaser.GameObjects.Rectangle;
  private valueText: Phaser.GameObjects.Text;
  private dragZone: Phaser.GameObjects.Zone;

  private static readonly BAR_WIDTH = 220;
  private static readonly BAR_HEIGHT = 30;

  volumeType: VolumeType;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    label: string,
    volumeType: VolumeType,
    private audioManager: AudioManager
  ) {
    super(scene, x, y);
    scene.add.existing(this);
    this.volumeType = volumeType;
    const initialVolume = this.getVolume() * 100;

    const labelText = scene.add.text(0, 0, label, {
      fontSize: "24px",
      fontFamily: "Lucida Console, monospace",
      color: "#ffffff",
    });

    const barBg = scene.add
      .rectangle(
        0,
        40,
        VolumeControl.BAR_WIDTH,
        VolumeControl.BAR_HEIGHT,
        colors.overlay.number,
        0.9
      )
      .setOrigin(0, 0.5);

    this.barFill = scene.add
      .rectangle(
        0,
        40,
        (initialVolume / 100) * VolumeControl.BAR_WIDTH,
        VolumeControl.BAR_HEIGHT,
        colors.background.number,
        0.9
      )
      .setOrigin(0, 0.5);

    this.valueText = scene.add.text(
      VolumeControl.BAR_WIDTH + 10,
      30,
      `${Math.round(initialVolume)}%`,
      {
        fontSize: "20px",
        fontFamily: "Lucida Console, monospace",
        color: "#ffffff",
      }
    );

    const minusBtn = new TaskButton({
      scene,
      title: "-",
      action: () => this.adjustVolume(-5),
      x: VolumeControl.BAR_WIDTH + 100,
      y: 40,
      height: 30,
      width: 30,
      borderThickness: 1,
    });

    const plusBtn = new TaskButton({
      scene,
      x: VolumeControl.BAR_WIDTH + 140,
      y: 40,
      title: "+",
      action: () => this.adjustVolume(5),
      height: 30,
      width: 30,
      borderThickness: 1,
    });

    this.dragZone = scene.add
      .zone(0, 30, VolumeControl.BAR_WIDTH, VolumeControl.BAR_HEIGHT)
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", (pointer: Phaser.Input.Pointer) =>
        this.updateByPointer(pointer)
      )
      .on("pointermove", (pointer: Phaser.Input.Pointer) => {
        if (pointer.isDown) this.updateByPointer(pointer);
      });

    this.add([
      labelText,
      minusBtn.container,
      plusBtn.container,
      barBg,
      this.barFill,
      this.valueText,
      this.dragZone,
    ]);
  }

  private getVolume(): number {
    switch (this.volumeType) {
      case "master":
        return this.audioManager.getMasterVolume();
      case "bgm":
        return this.audioManager.getBGMVolume();
      case "sfx":
        return this.audioManager.getSFXVolume();
    }
  }

  private setVolume(vol: number): void {
    switch (this.volumeType) {
      case "master":
        this.audioManager.setMasterVolume(vol);
        break;
      case "bgm":
        this.audioManager.setBGMVolume(vol);
        break;
      case "sfx":
        this.audioManager.setSFXVolume(vol);
        
        this.scene.sound.play("btnUiPress", { volume: vol });
        break;
    }
  }

  private adjustVolume(amount: number): void {
    const current = this.getVolume() * 100;
    const newVal = Phaser.Math.Clamp(current + amount, 0, 100);
    this.applyVolume(newVal);
  }

  private updateByPointer(pointer: Phaser.Input.Pointer): void {
    console.log(pointer.x);
    const localX = pointer.x - this.getWorldPoint().x;
    const percentage = Phaser.Math.Clamp(
      localX / VolumeControl.BAR_WIDTH,
      0,
      1
    );
    this.applyVolume(percentage * 100);
  }

  private applyVolume(value: number): void {
    const newVol = Phaser.Math.Clamp(value / 100, 0, 1);
    this.setVolume(newVol);
    this.barFill.width = newVol * VolumeControl.BAR_WIDTH;
    this.valueText.setText(`${Math.round(newVol * 100)}%`);
  }

  public reset(): void {
    this.applyVolume(100);
  }
}
