import { VNode } from "snabbdom";

export interface Component<S extends AnyState> {
  createNode: (state: S) => VNode;
  mount: (mountPoint: Element) => void;
  render: () => VNode;
}

export type AnyState = Record<string, any>;

export type SetStateFunc<S extends AnyState> = (
  nameOrState: keyof S | Record<keyof S, any>,
  value?: any
) => void;

export interface SetupArg<S extends AnyState> {
  set: SetStateFunc<S>;
  initialState: S;
}

export interface Setup<S extends AnyState> {
  (arg?: SetupArg<S>): Render<S>;
  $workFrameId?: string;
}

export type OnRenderAction<S extends AnyState> = (state: S) => void;

export type OnMountAction<S extends AnyState> = (state: S) => void;

export type Render<S extends AnyState> = (state: S) => JSX.Element | VNode;

export type ComponentFactory<S extends AnyState> = any;
