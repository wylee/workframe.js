import { AnyState, ComponentFactory, Setup } from "./interfaces";
import { makeComponentFactory } from "./component";

/**
 * Component registry.
 */
export class Registry {
  private factories: Record<string, any> = {};
  private setupId = 1;

  /**
   * Register a component's setup function.
   *
   * This takes a setup function and produces a component *factory*. The
   * factory is registered in this registry.
   *
   * @param setup Component setup function
   */
  registerSetupFunction<S extends AnyState>(
    setup: Setup<S>
  ): ComponentFactory<S> {
    const factory = makeComponentFactory(setup);
    const id = `${setup.name}-${this.setupId++}`;
    setup.$workFrameId = id;
    return this.registerComponentFactory(id, factory);
  }

  /**
   * Register a component factory.
   *
   * @param key
   * @param factory
   */
  registerComponentFactory<S extends AnyState>(
    key: string,
    factory: ComponentFactory<S>
  ): ComponentFactory<S> {
    return (this.factories[key] = factory);
  }

  /**
   * Get a component factory by key.
   *
   * @param key
   */
  getFactory<S extends AnyState>(
    key?: string
  ): ComponentFactory<S> | undefined {
    if (typeof key === "undefined") {
      return undefined;
    }
    return this.factories[key];
  }
}

const registry = new Registry();
export default registry;
