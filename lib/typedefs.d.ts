export declare type AnyState = Record<string, any>;
export declare type Setup<S extends AnyState> = () => Render<S>;
export declare type OnMountAction<S extends AnyState> = (state: S, set: (name: keyof S, value: any) => void) => void;
export declare type OnRenderAction<S extends AnyState> = (state: S, set: (name: keyof S, value: any) => void) => void;
export declare type Render<S> = (state: S, set: (name: keyof S, value: any) => void) => JSX.Element;
