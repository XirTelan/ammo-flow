type Listener<T> = (value: T) => void;

export class GameState {
  private static instance: GameState;

  private _workers = 1;
  private _scientists = 0;
  private _health = 100;

  private listeners: Record<string, Listener<any>[]> = {};

  private constructor() {}

  static getInstance(): GameState {
    if (!GameState.instance) {
      GameState.instance = new GameState();
    }
    return GameState.instance;
  }

  get workers() {
    return this._workers;
  }
  set workers(value: number) {
    this._workers = value;
    this.notify("money", value);
  }

  get scientists() {
    return this._scientists;
  }
  set scientists(value: number) {
    this._scientists = value;
    this.notify("score", value);
  }

  get health() {
    return this._health;
  }
  set health(value: number) {
    this._health = value;
    this.notify("health", value);
  }

  onChange<T>(key: keyof GameState, callback: Listener<T>) {
    if (!this.listeners[key]) this.listeners[key] = [];
    this.listeners[key].push(callback);
  }

  private notify(key: string, value: any) {
    this.listeners[key]?.forEach((cb) => cb(value));
  }

  reset() {
    this._workers = 0;
    this._scientists = 0;
    this.health = 100;
  }
}
