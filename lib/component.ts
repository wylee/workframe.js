import { onMountActions, onRenderActions } from "./hooks";
import { VNode } from "./nodes";
import { render } from "./render";
import {
  Render,
  OnMountAction,
  OnRenderAction,
  AnyState,
  Setup,
} from "./typedefs";

export default class Component<S extends AnyState> {
  private readonly state: S;
  private readonly renderer: Render<S>;
  private node: VNode;
  private readonly onMountActions: OnMountAction<S>[];
  private readonly onRenderActions: OnRenderAction<S>[];

  constructor(
    private readonly setup: Setup<S>,
    private mountPoint: Element | null,
    private readonly initialState: S
  ) {
    this.state = { ...initialState };
    this.renderer = setup(this.set.bind(this));
    this.node = this.renderer(this.state) as VNode;
    this.onMountActions = [...onMountActions];
    this.onRenderActions = [...onRenderActions];
    onMountActions.splice(0, onMountActions.length);
    onRenderActions.splice(0, onRenderActions.length);
  }

  getNode() {
    return this.node;
  }

  /**
   * Set a single state value or multiple state values.
   *
   * @param nameOrState
   *   Name of state entry to set *or* an object with key/value pairs
   *   of entries to set.
   * @param value
   *   Value of state entry when {@param nameOrState} is a name.
   * @throws Error
   *   When {@param nameOrState} is an object *and* {@param value} is
   *   passed too.
   */
  set(nameOrState: keyof S | Record<keyof S, any>, value?: any) {
    if (typeof nameOrState === "object") {
      if (typeof value !== "undefined") {
        throw new Error("value can't be passed when setting state from object");
      }
      Object.entries(nameOrState).forEach(([name, val]) => {
        if (typeof val === "function") {
          val = val(this.state[name]);
        }
        this.state[name as keyof S] = val;
      });
    } else {
      if (typeof value === "function") {
        value = value(this.state[nameOrState]);
      }
      this.state[nameOrState] = value;
    }
    this.render();
  }

  /**
   * Mount this component at the specified mount point.
   *
   * The component will be rendered as a child of the specified mount
   * point. This is essentially a special case of {@property render}
   * that first sets {@property mountPoint}.
   *
   * @param mountPoint
   */
  mount(mountPoint: Element) {
    this.setMountPoint(mountPoint);
    this.render(true);
  }

  setMountPoint(mountPoint: Element) {
    this.mountPoint = mountPoint;
  }

  render(mount = false) {
    const state = this.state;
    const oldNode = this.node;
    // XXX: Render functions are defined to return JSX.Element but after
    //      transformation they return VNode. That's why any is used as
    //      the type here. (Is there a better way to handle this?)
    const newNode: any = this.renderer(state);
    this.node = newNode as VNode;
    if (this.mountPoint) {
      render(this, newNode, this.mountPoint, oldNode);
    }
    requestAnimationFrame(() => {
      if (mount) {
        this.onMountActions.forEach((action) => {
          action(state);
        });
      }
      this.onRenderActions.forEach((action) => {
        action(state);
      });
    });
  }

  get Renderer(): Render<S> {
    return this.renderer;
  }
}
