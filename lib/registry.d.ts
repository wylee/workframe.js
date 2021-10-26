import Component from "./component";
/**
 * Global registry.
 */
export default class Registry {
    components: Component<any>[];
    registerComponent<S>(component: Component<S>): void;
}
