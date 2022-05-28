import { Action, AnyState, ComponentFactory, OnMountAction, OnRenderAction, Render, Setup } from "./interfaces";
/**
 * Component registry.
 */
declare class Registry {
    getAppState: () => AnyState;
    updateAppState: (action: Action<any>) => AnyState;
    private setupFunctions;
    private factories;
    private mountActions;
    private renderActions;
    /**
     * Register a function that returns the app's current state.
     *
     * @param getAppState
     */
    registerGetAppState(getAppState: () => AnyState): void;
    /**
     * Register a function that sets the app's current state.
     *
     * @param updateAppState
     */
    registerUpdateAppState<T>(updateAppState: (action: Action<T>) => AnyState): void;
    /**
     * Get the component factory associated with the specified setup
     * function. If the associated factory hasn't been registered yet,
     * it will be registered and returned.
     *
     * @param setup Component setup function
     */
    getOrRegisterComponentFactory<S extends AnyState>(setup: Setup<S>): ComponentFactory<S>;
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
    private registerSetupFunction;
    /**
     * Set up a component instance and return its render function.
     *
     * @param setup Component setup function
     * @returns The component's ID & render function
     */
    setUpComponent<S extends AnyState>(setup: Setup<S>, initialState: S): [number, Render<S>];
    /**
     * Add mount action for component currently being registered.
     *
     * @param id
     * @param action
     */
    addMountAction(action: OnMountAction<any>): void;
    /**
     * Get mount actions for component.
     *
     * @param id
     */
    getMountActions<S extends AnyState>(id: number): OnMountAction<any>[];
    /**
     * Add render action for component currently being registered.
     *
     * @param id
     * @param action
     */
    addRenderAction(action: OnRenderAction<any>): void;
    /**
     * Get render actions for component.
     *
     * @param id
     */
    getRenderActions<S extends AnyState>(id: number): OnRenderAction<any>[];
}
declare const _default: Registry;
export default _default;
