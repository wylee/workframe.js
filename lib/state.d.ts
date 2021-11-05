import { AnyState } from "./interfaces";
/**
 * State container.
 */
export default class State {
  private data;
  constructor(initialData: AnyState);
  set(name: string, value: unknown): void;
}
