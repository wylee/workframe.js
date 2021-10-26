import { AnyState } from "./typedefs";
/**
 * State container.
 */
export default class State {
    private data;
    constructor(initialData: AnyState);
    set(name: string, value: unknown): void;
}
