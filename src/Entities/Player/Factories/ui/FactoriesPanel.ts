import { Scene } from "phaser";
import { FactoryUi } from "./FactoryUi";
import { colors } from "../../../../helpers/config";
import { TaskButton } from "./FactoryTasks/TaskButton";
import { Factory } from "../Factory";
import { AllAmmoData } from "@helpers/types";

const PANEL_POSITION = { x: 1475, y: 340 };
const TASK_SELECTOR_POSITION = { x: 1485, y: 350 };
const TITLE_WIDTH = 200;
const TITLE_HEIGHT = 40;

const FACTORYUI_OFFSET = 180;

const BUTTON_SPACING = 50;
const SCROLL_VIEW_WIDTH = 400;
const SCROLL_VIEW_HEIGHT = 700;

export class FactoriesPanel {
  private scene: Scene;
  private factoriesContainer: Phaser.GameObjects.Container;
  private taskSelector: Phaser.GameObjects.Container;

  private scrollbarContainer: Phaser.GameObjects.Container;
  private scrollbarThumb: Phaser.GameObjects.Rectangle;

  private totalScrollHeight: number = 0;

  private selectedFactory?: Factory;

  constructor(scene: Scene, factories: Factory[]) {
    this.scene = scene;

    this.factoriesContainer = scene.add.container(
      PANEL_POSITION.x,
      PANEL_POSITION.y
    );

    this.taskSelector = scene.add.container(
      TASK_SELECTOR_POSITION.x,
      TASK_SELECTOR_POSITION.y
    );

    factories.forEach((factory, indx) =>
      this.addFactory(0, indx * FACTORYUI_OFFSET, factory)
    );

    this.createScrollbar();
    this.drawTasks();
    this.applyMask();
    this.setupInput();
  }

  private addFactory(x: number, y: number, factory: Factory) {
    const factoryUi = new FactoryUi(this.scene, x, y, factory);
    this.factoriesContainer.add(factoryUi.container);
  }

  private drawTasks() {
    const { ammo }: { ammo: AllAmmoData } = this.scene.cache.json.get("ammo");

    let currentY = 0;
    const SECTION_PADDING = 20;

    const bg = this.scene.add
      .rectangle(
        0,
        0,
        SCROLL_VIEW_WIDTH,
        SCROLL_VIEW_HEIGHT,
        colors.overlay.number
      )
      .setOrigin(0);
    this.scrollbarContainer.add(bg);
    for (const [turret, actions] of Object.entries(ammo)) {
      const actionKeys = Object.keys(actions);
      this.drawSection(0, currentY, turret, actionKeys);

      const sectionHeight = actionKeys.length * BUTTON_SPACING + TITLE_HEIGHT;
      currentY += sectionHeight + SECTION_PADDING;
    }

    const repairBtn = new TaskButton(this.scene, 0, "repair", () => {}, false)
      .container;
    const cancelBtn = new TaskButton(
      this.scene,
      0,
      "cancel",
      () => {
        this.taskSelector.setVisible(false);
        this.scrollbarContainer.setVisible(false);
        this.factoriesContainer.setVisible(true);
      },
      false
    ).container;
    repairBtn.setPosition(180, -10);
    cancelBtn.setPosition(180, 40);
    this.taskSelector.add([repairBtn, cancelBtn]);
    this.totalScrollHeight = currentY;
    this.updateScrollbar();
  }

  private drawSection(x: number, y: number, title: string, actions: string[]) {
    const container = this.scene.add.container(x, y);

    actions.forEach((action, index) => {
      const button = new TaskButton(
        this.scene,
        index * BUTTON_SPACING + 40,
        action,
        () => {}
      ).container;
      container.add(button);
    });

    container.add(this.createSectionTitle(title));
    this.taskSelector.add(container);
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
      color: "#000",
    });

    return [bg, text];
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
    this.taskSelector.setMask(mask);
  }

  private setupInput() {
    const minY =
      TASK_SELECTOR_POSITION.y - this.totalScrollHeight + SCROLL_VIEW_HEIGHT;
    const maxY = TASK_SELECTOR_POSITION.y;

    this.scene.input.on(
      "wheel",
      (
        pointer: Phaser.Input.Pointer,
        _gameObjects: Phaser.GameObjects.GameObject[],
        _deltaX: number,
        deltaY: number
      ) => {
        if (this.isOutBound(pointer.x, pointer.y)) return;

        this.taskSelector.y = Phaser.Math.Clamp(
          this.taskSelector.y - deltaY * 0.5,
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
      this.taskSelector.y = Phaser.Math.Clamp(
        this.taskSelector.y + delta,
        minY,
        maxY
      );
      lastY = pointer.y;
      this.updateScrollbar();
    });
  }

  private createScrollbar() {
    const track = this.scene.add
      .rectangle(-10, 0, 8, SCROLL_VIEW_HEIGHT, 0x888888, 0.2)
      .setOrigin(0, 0);
    this.scrollbarThumb = this.scene.add
      .rectangle(-10, 0, 8, 40, colors.backgroundAccent.number)
      .setOrigin(0, 0);
    this.scrollbarThumb.setInteractive({ useHandCursor: true });
    this.scrollbarContainer = this.scene.add.container(
      TASK_SELECTOR_POSITION.x,
      TASK_SELECTOR_POSITION.y,
      [track, this.scrollbarThumb]
    );
  }
  private isOutBound(x: number, y: number) {
    return x < 1450 || x > 1900 || y < 400 || y > 1050;
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
      (TASK_SELECTOR_POSITION.y - this.taskSelector.y) / scrollRange,
      0,
      1
    );

    this.scrollbarThumb.y = scrollPercent * (SCROLL_VIEW_HEIGHT - thumbHeight);
  }
}
