import { VNode } from "snabbdom";

export type AnyState = Record<string, any>;

export interface Setup<S extends AnyState> {
  (initialState?: S): Render<S>;
}

export type OnMountAction<S extends AnyState> = (appState: S) => void;

export type OnRenderAction<S extends AnyState> = (appState: S) => void;

export type Render<S extends AnyState> = (
  state: S,
  children?: any[]
) => JSX.Element | VNode;

export type ComponentFactory<S extends AnyState> = (
  initialState: S
) => Component<S>;

export interface Component<S extends AnyState> {
  id: number;
  name: string;
  runOnMountActions: () => void;
  runOnRenderActions: () => void;
  createNode: (state: S, children?: any[]) => VNode;
}

export interface Action<T> {
  type: T;
  data?: any;
}
