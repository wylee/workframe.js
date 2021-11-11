import { AnyState, ComponentFactory, Setup } from "./interfaces";
import { makeComponentFactory } from "./component";

/**
 * Component registry.
 */
class Registry {
  private factories: any[] = [];

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
   * Get a component factory by key.
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
    const factory = makeComponentFactory(setup);
    this.registerComponentFactory(factory);
    setup.workframeId = this.factories.length - 1;
    return factory;
  }
}

export default new Registry();
