import { VNode } from "snabbdom";
export declare type AnyState = Record<string, any>;
export interface Action<T> {
    type: T;
    data?: any;
}
export interface Setup<S extends AnyState> {
    (initialState?: S): Render<S>;
    workframeId?: number;
}
export declare type OnMountAction<S extends AnyState> = (state: S) => void;
export declare type OnRenderAction<S extends AnyState> = (state?: S) => void;
export declare type Render<S extends AnyState> = (state: S, children?: any[]) => JSX.Element | VNode;
export declare type ComponentFactory<S extends AnyState> = (initialState: S) => Component<S>;
export interface Component<S extends AnyState> {
    name: string;
    runOnMountActions: () => void;
    runOnRenderActions: (state?: S) => void;
    createNode: (state: S, children?: any[]) => VNode;
}
