export type AnyState = Record<string, any>;

export type SetStateArg<S> = keyof S | Record<keyof S, any>;

export type Setup<S extends AnyState> = (
  set: (nameOrState: SetStateArg<S>, value?: any) => void
) => Render<S>;

export type OnMountAction<S extends AnyState> = (state: S) => void;

export type OnRenderAction<S extends AnyState> = (state: S) => void;

export type Render<S> = (state: S) => JSX.Element;
