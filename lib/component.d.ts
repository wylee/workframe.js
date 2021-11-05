import { Render, OnMountAction, OnRenderAction, AnyState } from "./interfaces";
export default class Component<S extends AnyState> {
  private readonly state;
  private readonly mountPoint;
  private readonly renderer;
  private readonly onMountActions;
  private readonly onRenderActions;
  constructor(
    state: S,
    mountPoint: Element,
    renderer: Render<S>,
    onMountActions: OnMountAction<S>[],
    onRenderActions: OnRenderAction<S>[]
  );
  /**
   * Get state value.
   *
   * @param name
   */
  get(name: keyof S): any;
  /**
   * Set state value.
   *
   * @param name
   * @param value
   */
  set(name: keyof S, value: any): void;
  getState(): S;
  mount(): void;
  render(mount?: boolean): void;
}
