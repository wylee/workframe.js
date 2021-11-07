import { VNode } from "snabbdom";

export interface Component<S extends AnyState> {
  runOnRenderActions: () => void;
  runOnMountActions: () => void;
  createNode: (state: S) => VNode;
  mount: (mountPoint: Element) => void;
  render: () => void;
}

export type AnyState = Record<string, any>;

export type GetStateFunc<S extends AnyState> = (name: keyof S) => any;

export type SetStateFunc<S extends AnyState> = (
  nameOrState: keyof S | Record<keyof S, any>,
  value?: any
) => void;

export interface SetupArg<S extends AnyState> {
  initialState: S;
  get: GetStateFunc<S>;
  set: SetStateFunc<S>;
  reset: () => void;
}

export interface Setup<S extends AnyState> {
  (arg?: SetupArg<S>): Render<S>;
  $workFrameId?: string;
}

export type OnRenderAction<S extends AnyState> = (state: S) => void;

export type OnMountAction<S extends AnyState> = (state: S) => void;

export type Render<S extends AnyState> = (state: S) => JSX.Element | VNode;

export type ComponentFactory<S extends AnyState> = any;
