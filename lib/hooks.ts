import { AnyState } from "./interfaces";
import registry from "./registry";

/**
 * Hook to register an action to be run when a component is mounted.
 *
 * The action will be run *once* when the component is mounted, right
 * after it's first rendered.
 *
 * XXX: Mount actions run *before* render actions. Perhaps this is
 *      backwards?
 *
 * @param action
 */
export function onMount<S extends AnyState>(action: (appState: S) => void) {
  registry.addMountAction(action);
}

/**
 * Hook to register an action to be run when a component is rendered.
 *
 * Note that the action will be run *after* the component is rendered.
 *
 * XXX: Render actions run *after* mount actions. Perhaps this is
 *      backwards?
 *
 * @param action
 */
export function onRender<S extends AnyState>(action: (appState: S) => void) {
  registry.addRenderAction(action);
}
