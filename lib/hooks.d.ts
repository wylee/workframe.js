import { AnyState, OnRenderAction, OnMountAction } from "./interfaces";
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
export declare function onMount<S extends AnyState>(action: (appState: S) => void): void;
export declare function consumeOnMountActions<S extends AnyState>(): OnMountAction<S>[];
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
export declare function onRender<S extends AnyState>(action: (appState: S) => void): void;
export declare function consumeOnRenderActions<S extends AnyState>(): OnRenderAction<S>[];
