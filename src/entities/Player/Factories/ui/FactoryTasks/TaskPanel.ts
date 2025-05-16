import { colors } from "@/helpers/config";
import { AllAmmoData, TurretType } from "@/helpers/types";
import { TASK_SELECTOR_POSITION } from "../../constants";
import { TaskButton } from "./TaskButton";
import { Scene } from "phaser";
import { FactoriesPanel } from "../FactoriesPanel";
import { AmmoDetails } from "./AmmoDetails";

const SCROLL_VIEW_WIDTH = 350;
const SCROLL_VIEW_HEIGHT = 710;
const BUTTON_SPACING = 50;
const TITLE_WIDTH = 200;
const TITLE_HEIGHT = 40;

export class TaskPanel {
  scene: Scene;
  contentContainer: Phaser.GameObjects.Container;
  tasksContainer: Phaser.GameObjects.Container;
  factoryPanel: FactoriesPanel;
  ammoDetails: AmmoDetails;
  private scrollbarContainer: Phaser.GameObjects.Container;
  private scrollbarThumb: Phaser.GameObjects.Rectangle;

  private totalScrollHeight: number = 0;

  constructor(scene: Scene, factoryPanel: FactoriesPanel) {
    this.scene = scene;
    this.factoryPanel = factoryPanel;
    this.ammoDetails = new AmmoDetails(
      scene,
      TASK_SELECTOR_POSITION.x + 20,
      80
    );

    this.contentContainer = scene.add.container(
      TASK_SELECTOR_POSITION.x,
      TASK_SELECTOR_POSITION.y
    );
    this.tasksContainer = scene.add.container();

    const bg = this.scene.add
      .rectangle(
        -10,
        -10,
        SCROLL_VIEW_WIDTH + 10,
        SCROLL_VIEW_HEIGHT + 10,
        colors.overlay.number
      )
      .setOrigin(0);

    this.createScrollbar();
    this.drawTasks();
    this.applyMask();
    this.setupInput();
    this.contentContainer.add([
      bg,
      this.scrollbarContainer,
      this.tasksContainer,
    ]);
    this.sideBtns();
    this.hide();
  }

  private applyMask() {
    const maskGraphics = this.scene.make.graphics({});
    maskGraphics.fillStyle(0xffffff);
    maskGraphics.fillRect(
      TASK_SELECTOR_POSITION.x,
      TASK_SELECTOR_POSITION.y,
      SCROLL_VIEW_WIDTH,
      SCROLL_VIEW_HEIGHT
    );
    const mask = maskGraphics.createGeometryMask();
    this.tasksContainer.setMask(mask);
  }
  private isOutBound(x: number, y: number) {
    return x < 1450 || x > 1900 || y < 400 || y > 1050;
  }

  private createLineGraphics(
    x: number,
    y: number,
    width: number,
    height: number
  ) {
    const graphics = this.scene.add.graphics();
    graphics.lineStyle(4, colors.backgroundAccent.number);
    graphics.lineBetween(x - width, y - height, x - width, y + 1);
    graphics.lineBetween(x - width - 1, y, x - width + 15, y);
    return graphics;
  }

  private drawSection(x: number, y: number, title: string, actions: string[]) {
    const container = this.scene.add.container(x, y);

    actions.forEach((action, index) => {
      const button = new TaskButton({
        scene: this.scene,
        x: 100,
        y: index * BUTTON_SPACING + TITLE_HEIGHT * 2,
        title: action,
        action: () => {
          this.factoryPanel.selectedFactory?.setAmmoProduction(
            title as TurretType,
            action
          );
          this.ammoDetails.hide();
          this.hide();
        },
        width: 150,
        height: 40,
        borderThickness: 2,
      });
      button.btn.on("pointerover", () => {
        this.ammoDetails.update(title as TurretType, action);
        this.ammoDetails.show();
      });
      button.btn.on("pointerout", () => {
        this.ammoDetails.hide();
      });
      const lines = this.createLineGraphics(
        button.container.x,
        button.container.y,
        90,
        50
      );
      container.add([button.container, lines]);
    });

    container.add(this.createSectionTitle(title));
    this.tasksContainer.add(container);
  }

  private createSectionTitle(title: string): Phaser.GameObjects.GameObject[] {
    const bg = this.scene.add
      .rectangle(
        0,
        0,
        TITLE_WIDTH,
        TITLE_HEIGHT,
        colors.backgroundAccent.number
      )
      .setOrigin(0);
    const text = this.scene.add.text(10, 10, title.toUpperCase(), {
      fontSize: "18px",
      fontFamily: "Lucida Console, monospace",
      fontStyle: "bold",
      color: "#444",
    });

    return [bg, text];
  }
  private drawTasks() {
    const { ammo }: { ammo: AllAmmoData } = this.scene.cache.json.get("ammo");

    let currentY = 0;
    const SECTION_PADDING = 20;

    for (const [turret, actions] of Object.entries(ammo)) {
      const actionKeys = Object.keys(actions);
      this.drawSection(0, currentY, turret, actionKeys);

      const sectionHeight = actionKeys.length * BUTTON_SPACING + TITLE_HEIGHT;
      currentY += sectionHeight + SECTION_PADDING;
    }

    this.totalScrollHeight = currentY;
    this.updateScrollbar();
  }

  private sideBtns() {
    const repairBtn = new TaskButton({
      x: 260,
      y: 20,
      scene: this.scene,
      title: "repair",
      action: () => {
        this.factoryPanel.selectedFactory?.switchToRepair();
        this.hide();
      },
      width: 100,
      height: 50,
    }).container;
    const cancelBtn = new TaskButton({
      x: 260,
      y: 80,
      scene: this.scene,
      title: "cancel",
      action: () => this.hide(),
      width: 100,
      height: 50,
    }).container;

    this.contentContainer.add([repairBtn, cancelBtn]);
  }

  private createScrollbar() {
    const track = this.scene.add
      .rectangle(-10, 0, 8, SCROLL_VIEW_HEIGHT, 0x888888, 0.2)
      .setOrigin(0, 0);
    this.scrollbarThumb = this.scene.add
      .rectangle(-10, 0, 8, 40, colors.backgroundAccent.number)
      .setOrigin(0, 0);
    this.scrollbarThumb.setInteractive({ useHandCursor: true });
    this.scrollbarContainer = this.scene.add.container(0, 0, [
      track,
      this.scrollbarThumb,
    ]);
  }
  private updateScrollbar() {
    const scrollRange = this.totalScrollHeight - SCROLL_VIEW_HEIGHT;

    if (scrollRange <= 0) {
      this.scrollbarThumb.setVisible(false);
      return;
    }

    this.scrollbarThumb.setVisible(true);

    const thumbHeight = Math.max(
      (SCROLL_VIEW_HEIGHT / this.totalScrollHeight) * SCROLL_VIEW_HEIGHT,
      30
    );
    this.scrollbarThumb.height = thumbHeight;

    const scrollPercent = Phaser.Math.Clamp(
      (0 - this.tasksContainer.y) / scrollRange,
      0,
      1
    );

    this.scrollbarThumb.y = scrollPercent * (SCROLL_VIEW_HEIGHT - thumbHeight);
  }
  private setupInput() {
    const minY = 0 - this.totalScrollHeight + SCROLL_VIEW_HEIGHT;
    const maxY = 0;

    this.scene.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        _gameObjects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number
      ) => {
        if (this.isOutBound(pointer.x, pointer.y)) return;

        this.tasksContainer.y = Phaser.Math.Clamp(
          this.tasksContainer.y - deltaY * 0.5,
          minY,
          maxY
        );
        this.updateScrollbar();
      }
    );

    let isDragging = false;
    let lastY = 0;

    this.scene.input.on("pointerdown", (pointer: Phaser.Input.Pointer) => {
      if (this.isOutBound(pointer.x, pointer.y)) return;
      isDragging = true;
      lastY = pointer.y;
    });

    this.scene.input.on("pointerup", () => {
      isDragging = false;
    });

    this.scene.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
      if (this.isOutBound(pointer.x, pointer.y)) return;
      if (!isDragging) return;

      const delta = pointer.y - lastY;
      this.tasksContainer.y = Phaser.Math.Clamp(
        this.tasksContainer.y + delta,
        minY,
        maxY
      );
      lastY = pointer.y;
      this.updateScrollbar();
    });
  }

  show() {
    this.contentContainer.setVisible(true);
  }

  hide() {
    this.contentContainer.setVisible(false);
  }
}
