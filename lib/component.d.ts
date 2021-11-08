import { AnyState, ComponentFactory, Setup } from "./interfaces";
/**
 * Make a factory for creating components from a setup function.
 *
 * For each *instance* of the component, the factory will be called with
 * the instance's initial state.
 *
 * @param setup
 */
export declare function makeComponentFactory<S extends AnyState>(setup: Setup<S>): ComponentFactory<S>;
