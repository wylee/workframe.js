import { AnyState, ComponentFactory, Setup } from "./interfaces";
/**
 * Component registry.
 */
declare class Registry {
    private factories;
    /**
     * Get the component factory associated with the specified setup
     * function. If the associated factory hasn't been registered yet,
     * it will be registered and returned.
     *
     * @param setup Component setup function
     */
    getOrRegisterComponentFactory<S extends AnyState>(setup: Setup<S>): ComponentFactory<S>;
    /**
     * Get a component factory by key.
     *
     * @param id
     */
    getFactory<S extends AnyState>(id?: number): ComponentFactory<S> | undefined;
    /**
     * Register a component factory.
     *
     * @param factory
     */
    private registerComponentFactory;
    /**
     * Register a component's setup function.
     *
     * This takes a setup function and produces a component *factory*. The
     * factory is registered in this registry.
     *
     * @param setup Component setup function
     */
    private registerSetupFunction;
}
declare const _default: Registry;
export default _default;
