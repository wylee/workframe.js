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

  private setupFunctions: any[] = [];
  private factories: any[] = [];
  private mountActions: OnMountAction<any>[][] = [];
  private renderActions: OnRenderAction<any>[][] = [];

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
    const index = this.setupFunctions.indexOf(setup);
    return this.factories[index] || this.registerSetupFunction(setup);
  }

  /**
   * Register a component's setup function.
   *
   * This takes a setup function and produces a component factory.
   * The component factory will be used to produce component instances.
   *
   * Both the setup function and factory are registered.
   *
   * @param setup Component setup function
   * @returns Component factory
   */
  private registerSetupFunction<S extends AnyState>(
    setup: Setup<S>
  ): ComponentFactory<S> {
    const factory = makeComponentFactory(setup, this.getAppState);
    this.setupFunctions.push(setup);
    this.factories.push(factory);
    return factory;
  }

  /**
   * Set up a component instance and return its render function.
   *
   * @param setup Component setup function
   * @returns The component's ID & render function
   */
  public setUpComponent<S extends AnyState>(
    setup: Setup<S>,
    initialState: S
  ): [number, Render<S>] {
    const id = this.mountActions.length;
    this.mountActions.push([]);
    this.renderActions.push([]);
    return [id, setup(initialState)];
  }

  /**
   * Add mount action for component currently being registered.
   *
   * @param id
   * @param action
   */
  public addMountAction(action: OnMountAction<any>) {
    const index = this.mountActions.length - 1;
    const actions = this.mountActions[index];
    actions.push(action);
  }

  /**
   * Get mount actions for component.
   *
   * @param id
   */
  public getMountActions<S extends AnyState>(id: number) {
    return this.mountActions[id];
  }

  /**
   * Add render action for component currently being registered.
   *
   * @param id
   * @param action
   */
  public addRenderAction(action: OnRenderAction<any>) {
    const index = this.renderActions.length - 1;
    const actions = this.renderActions[index];
    actions.push(action);
  }

  /**
   * Get render actions for component.
   *
   * @param id
   */
  public getRenderActions<S extends AnyState>(id: number) {
    return this.renderActions[id];
  }
}

export default new Registry();
