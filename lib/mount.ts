import cloneDeep from "lodash/cloneDeep";
import { Action, AnyState, Setup } from "./interfaces";
import registry from "./registry";
import { patch } from "./vdom";

/**
 * Mount root component into DOM.
 *
 * NOTE: The mount point DOM element will be *replaced* by the mounted
 * node rather than being appended to it.
 *
 * @param setup Root component's setup function
 * @param mountPoint DOM node or selector to mount root component into
 * @param initialState Initial root state
 */
export function mount<S extends AnyState, T>(
  setup: Setup<S>,
  mountPoint: string | Element,
  initialState: S,
  updater: (state: S, action: Action<T>) => S
): (action: Action<T>) => S {
  if (typeof mountPoint === "string") {
    const element = document.querySelector(mountPoint);
    if (element) {
      mountPoint = element;
    } else {
      throw new Error(`DOM element matching selector not found: ${mountPoint}`);
    }
  }

  const rootFactory = registry.getOrRegisterComponentFactory(setup);
  const rootComponent = rootFactory();

  let state = cloneDeep(initialState);
  let rootNode = rootComponent.createNode(state);

  setTimeout(() => {
    rootNode = patch(mountPoint as Element, rootNode);
  });

  return function updateState(action: Action<T>): S {
    state = updater(state, action);
    const oldRootNode = rootNode;
    const newRootNode = rootComponent.createNode(state);
    rootNode = patch(oldRootNode, newRootNode);
    return state;
  };
}
