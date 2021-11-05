import { VNode } from "snabbdom";

export interface Component<S> {
  createNode: (state: S) => VNode;
  mount: (mountPoint: Element) => void;
  render: () => VNode;
}

export type AnyState = Record<string, any>;

export type SetStateFunc<S> = (
  nameOrState: keyof S | Record<keyof S, any>,
  value?: any
) => void;

export interface Setup<S extends AnyState> {
  (arg?: SetStateFunc<S>): Render<S>;
  $workFrameId?: string;
}

export type OnRenderAction<S extends AnyState> = (state: S) => void;

export type OnMountAction<S extends AnyState> = (state: S) => void;

export type Render<S> = (state: S) => JSX.Element;

export type ComponentFactory<S> = any;
