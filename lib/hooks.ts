import { OnMountAction, OnRenderAction } from "./typedefs";

export const onMountActions: OnMountAction<any>[] = [];
export const onRenderActions: OnRenderAction<any>[] = [];

/**
 * Run action when component is mounted.
 *
 * The action will be run *once* when the component is mounted, right
 * after it's first rendered.
 *
 * @param action
 */
export function onMount<S>(action: (state: S) => void) {
  onMountActions.push(action);
}

/**
 * Run action when component is rendered.
 *
 * Note that the action will be run *after* the component is rendered.
 *
 * @param action
 */
export function onRender<S>(action: (state: S) => void) {
  onRenderActions.push(action);
}
