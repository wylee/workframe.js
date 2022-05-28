import { Action, AnyState, Setup } from "./interfaces";
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
export declare function mount<S extends AnyState, T>(setup: Setup<S>, mountPoint: string | Element, initialState: S, updater: (state: S, action: Action<T>) => S, children?: any[]): (action: Action<T>) => S;
