import { AnyState, OnRenderAction, OnMountAction } from "./interfaces";
/**
 * Hook to register an action to be run when a component is rendered.
 *
 * Note that the action will be run *after* the component is rendered.
 *
 * @param action
 */
export declare function onRender<S extends AnyState>(action: (state: S) => void): void;
export declare function consumeOnRenderActions<S extends AnyState>(): OnRenderAction<S>[];
/**
 * Hook to register an action to be run when a component is mounted.
 *
 * The action will be run *once* when the component is mounted, right
 * after it's first rendered.
 *
 * @param action
 */
export declare function onMount<S extends AnyState>(action: (state: S) => void): void;
export declare function consumeOnMountActions<S extends AnyState>(): OnMountAction<S>[];
