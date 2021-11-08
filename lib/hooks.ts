import { AnyState, OnRenderAction, OnMountAction } from "./interfaces";

const onRenderActions: OnRenderAction<any>[] = [];
const onMountActions: OnMountAction<any>[] = [];

/**
 * Hook to register an action to be run when a component is rendered.
 *
 * Note that the action will be run *after* the component is rendered.
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
  onRenderActions.splice(0, onRenderActions.length);
}

/**
 * Hook to register an action to be run when a component is mounted.
 *
 * The action will be run *once* when the component is mounted, right
 * after it's first rendered.
 *
 * @param action
 */
export function onMount<S extends AnyState>(action: (state: S) => void) {
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
  onMountActions.splice(0, onMountActions.length);
}
