import { Setup, AnyState } from "./typedefs";
/**
 * Run action when component is mounted.
 *
 * The action will be run *once* when the component is mounted, right
 * after it's first rendered.
 *
 * @param action
 */
export declare function onMount<S>(action: (state: S, set: (name: keyof S, value: any) => void) => void): void;
/**
 * Run action when component is rendered.
 *
 * Note that the action will be run *after* the component is rendered.
 *
 * @param action
 */
export declare function onRender<S>(action: (state: S, set: (name: keyof S, value: any) => void) => void): void;
/**
 * Mount component into DOM.
 *
 * @param setup Component setup function
 * @param selector DOM node selector for component
 */
export declare function mount<S extends AnyState>(setup: Setup<S>, mountPoint: string | Element, initialState: S): void;
