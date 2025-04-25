import { FactoryUi } from "./FactoryUi";
import { Factory } from "../Factory";
import { FACTORY_UI_HEIGHT, PANEL_POSITION } from "../constants";
import { TaskPanel } from "./FactoryTasks/TaskPanel";
import { GameUi } from "@/scenes/GameUi";
import { FactoryControl } from "./FactoryControl";
import { colors } from "@/helpers/config";

export class FactoriesPanel {
  private scene: GameUi;
  private factoriesContainer: Phaser.GameObjects.Container;
  private taskPanel: TaskPanel;

  private _selectedFactory?: Factory;

  get selectedFactory() {
    return this._selectedFactory;
  }

  constructor(scene: GameUi, factories: Factory[]) {
    this.scene = scene;
    this.scene.add
      .rectangle(1450, 350, 360, 720, colors.overlay.number)
      .setOrigin(0);
    this.factoriesContainer = scene.add.container(
      PANEL_POSITION.x,
      PANEL_POSITION.y
    );

    factories.forEach((factory, indx) => this.addFactory(0, indx, factory));

    this.taskPanel = new TaskPanel(scene, this);
    this.scene.add.image(1680, 695, "factoriesPanel").setDepth(11);
  }

  private addFactory(x: number, y: number, factory: Factory) {
    const factoryUi = new FactoryUi(
      this.scene,
      x,
      y * FACTORY_UI_HEIGHT,
      factory
    );
    const factoryControl = new FactoryControl(
      this.scene,
      420,
      252 + y * 100,
      this,
      factory
    );
    this.factoriesContainer.add([
      factoryUi.container,
      factoryControl.container,
    ]);
  }

  changeTask(factory: Factory) {
    console.log(this.selectedFactory, factory);
    this._selectedFactory = factory;
    console.log(this.selectedFactory, factory);
    this.taskPanel.show();
  }
}
