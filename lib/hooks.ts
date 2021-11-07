import { OnRenderAction, OnMountAction } from "./interfaces";

const onRenderActions: OnRenderAction<any>[] = [];
const onMountActions: OnMountAction<any>[] = [];

/**
 * Hook to register an action to be run when a component is rendered.
 *
 * Note that the action will be run *after* the component is rendered.
 *
 * @param action
 */
export function onRender<S>(action: (state: S) => void) {
  onRenderActions.push(action);
}

export function pushAndClearOnRenderActions(receiver: any[]) {
  receiver.push(...onRenderActions);
  clearOnRenderActions();
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
export function onMount<S>(action: (state: S) => void) {
  onMountActions.push(action);
}

export function pushAndClearOnMountActions(receiver: any[]) {
  receiver.push(...onMountActions);
  clearOnMountActions();
}

function clearOnMountActions() {
  onMountActions.splice(0, onMountActions.length);
}
