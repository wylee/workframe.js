import cloneDeep from "lodash/cloneDeep";
import { Action, AnyState, Setup } from "./interfaces";
import registry from "./registry";
import { patch } from "./vdom";

/**
 * Mount root component into DOM and return update function.
 *
 * NOTE: The mount point DOM element will be *replaced* by the mounted
 * node rather than being appended to it.
 *
 * @param setup Root component's setup function
 * @param mountPoint DOM node or selector to mount root component into
 * @param initialState Initial root state
 * @param children Child nodes
 * @returns Function to update app state
 */
export function mount<S extends AnyState, T>(
  setup: Setup<S>,
  mountPoint: string | Element,
  initialState: S,
  updater: (state: S, action: Action<T>) => S,
  children?: any[]
): (action: Action<T>) => S {
  if (typeof mountPoint === "string") {
    const element = document.querySelector(mountPoint);
    if (element) {
      mountPoint = element;
    } else {
      throw new Error(`DOM element matching selector not found: ${mountPoint}`);
    }
  }

  let state = cloneDeep(initialState);

  function getState() {
    return state;
  }

  function updateState(action: Action<T>): S {
    state = updater(state, action);
    const oldRootNode = rootNode;
    const newRootNode = rootComponent.createNode(state, children);
    rootNode = patch(oldRootNode, newRootNode);
    return state;
  }

  registry.registerGetAppState(getState);
  registry.registerUpdateAppState(updateState);

  const rootFactory = registry.getOrRegisterComponentFactory(setup);
  const rootComponent = rootFactory(initialState);

  let rootNode = patch(
    mountPoint as Element,
    rootComponent.createNode(state, children)
  );

  return updateState;
}
