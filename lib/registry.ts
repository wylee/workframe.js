import {
  Action,
  AnyState,
  ComponentFactory,
  OnMountAction,
  OnRenderAction,
  Render,
  Setup,
} from "./interfaces";
import { makeComponentFactory } from "./component";

/**
 * Component registry.
 */
class Registry {
  public getAppState: () => AnyState = () => ({});
  public updateAppState: (action: Action<any>) => AnyState = () => ({});

  private factories: any[] = [];
  private currentComponentId = 0;
  private mountActions: { [id: number]: OnMountAction<any>[] } = {};
  private renderActions: { [id: number]: OnRenderAction<any>[] } = {};

  /**
   * Register a function that returns the app's current state.
   *
   * @param getAppState
   */
  public registerGetAppState(getAppState: () => AnyState) {
    this.getAppState = getAppState;
  }

  /**
   * Register a function that sets the app's current state.
   *
   * @param updateAppState
   */
  }

  /**
   * Get a component factory by ID.
   *
   * @param id
   */
  public getFactory<S extends AnyState>(
    id?: number
  ): ComponentFactory<S> | undefined {
    if (typeof id === "undefined") {
      return undefined;
    }
    return this.factories[id];
  public registerUpdateAppState<T>(updateAppState: (action: Action<T>) => AnyState) {
    this.updateAppState = updateAppState;
  }

  /**
   * Get the component factory associated with the specified setup
   * function. If the associated factory hasn't been registered yet,
   * it will be registered and returned.
   *
   * @param setup Component setup function
   */
  public getOrRegisterComponentFactory<S extends AnyState>(
    setup: Setup<S>
  ): ComponentFactory<S> {
    return (
      this.getFactory(setup.workframeId) || this.registerSetupFunction(setup)
    );
  }

  /**
   * Register a component's setup function.
   *
   * This takes a setup function and produces a component *factory*. The
   * factory is registered in this registry.
   *
   * @param setup Component setup function
   */
  private registerSetupFunction<S extends AnyState>(
    setup: Setup<S>
  ): ComponentFactory<S> {
    const factory = makeComponentFactory(setup, this.getState);
    this.registerComponentFactory(factory);
    setup.workframeId = this.factories.length - 1;
    return factory;
  }

  /**
   * Register a component factory.
   *
   * @param factory
   */
  private registerComponentFactory<S extends AnyState>(
    factory: ComponentFactory<S>
  ): ComponentFactory<S> {
    this.factories.push(factory);
    return factory;
  }

  /**
   * Call component setup function and return its render function.
   *
   * This sets the current component so that any `onMount` and/or
   * `onRender` hooks in the setup function will be registered to the
   * component.
   *
   * @param setup
   */
  public callSetup<S extends AnyState>(
    setup: Setup<S>,
    initialState: S
  ): Render<S> {
    this.currentComponentId = setup.workframeId as number;
    const render = setup(initialState);
    return render;
  }

  /**
   * Add mount action for *current* component.
   *
   * @param id
   * @param action
   */
  public addMountAction(action: OnMountAction<any>) {
    const id = this.currentComponentId;
    if (typeof this.mountActions[id] === "undefined") {
      this.mountActions[id] = [];
    }
    const actions = this.mountActions[id];
    actions.push(action);
  }

  /**
   * Get mount actions for component.
   *
   * @param id
   */
  public getMountActions(id?: number) {
    if (typeof id === "undefined") {
      throw new Error("Component setup ID was not initialized");
    }
    return this.mountActions[id];
  }

  /**
   * Add render action for *current* component.
   *
   * @param id
   * @param action
   */
  public addRenderAction(action: OnRenderAction<any>) {
    const id = this.currentComponentId;
    if (typeof this.renderActions[id] === "undefined") {
      this.renderActions[id] = [];
    }
    const actions = this.renderActions[id];
    actions.push(action);
  }

  /**
   * Get render actions for component.
   *
   * @param id
   */
  public getRenderActions(id?: number) {
    if (typeof id === "undefined") {
      throw new Error("Component setup ID was not initialized");
    }
    return this.renderActions[id];
  }
}

export default new Registry();
