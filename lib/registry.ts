import Component from "./component";

/**
 * Global registry.
 */
export class Registry {
  components: Component<any>[] = [];

  registerComponent<S>(component: Component<S>): void {
    this.components.push(component);
  }
}

const registry = new Registry();
export default registry;
