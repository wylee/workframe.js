import { AnyState, OnRenderAction, OnMountAction } from "./interfaces";

const onMountActions: OnMountAction<any>[] = [];
const onRenderActions: OnRenderAction<any>[] = [];

/**
 * Hook to register an action to be run when a component is mounted.
 *
 * The action will be run *once* when the component is mounted, right
 * after it's first rendered.
 *
 * Mount actions are always passed the component's *initial state*.
 *
 * XXX: Mount actions run *before* render actions. Perhaps this is
 *      backwards?
 *
 * @param action
 */
export function onMount<S extends AnyState>(action: (initialState: S) => void) {
  onMountActions.push(action);
}

export function consumeOnMountActions<
  S extends AnyState
>(): OnMountAction<S>[] {
  const actions = [...onMountActions];
  clearOnMountActions();
  return actions;
}

function clearOnMountActions() {
  onMountActions.splice(0);
}

/**
 * Hook to register an action to be run when a component is rendered.
 *
 * Note that the action will be run *after* the component is rendered.
 *
 * XXX: Currently they are passed the initial state
 * TODO: Figure out how to pass the current state
 * Render actions are always passed the component's *current state*.
 *
 * XXX: Render actions run *after* mount actions. Perhaps this is
 *      backwards?
 *
 * @param action
 */
export function onRender<S extends AnyState>(action: (state: S) => void) {
  onRenderActions.push(action);
}

export function consumeOnRenderActions<
  S extends AnyState
>(): OnRenderAction<S>[] {
  const actions = [...onRenderActions];
  clearOnRenderActions();
  return actions;
}

function clearOnRenderActions() {
  onRenderActions.splice(0);
}
