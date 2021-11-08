import { VNode } from "snabbdom";

export type AnyState = Record<string, any>;

export interface Action<T> {
  type: T;
  data?: any;
}

export interface Setup<S extends AnyState> {
  (initialState?: S): Render<S>;
  $workFrameId?: number;
}

export type OnRenderAction<S extends AnyState> = (state: S) => void;

export type OnMountAction<S extends AnyState> = (state: S) => void;

export type Render<S extends AnyState> = (state: S) => JSX.Element | VNode;

export type ComponentFactory<S extends AnyState> = any;

export interface Component<S extends AnyState> {
  runOnRenderActions: (state: S) => void;
  runOnMountActions: (state: S) => void;
  createNode: (state: S) => VNode;
}
