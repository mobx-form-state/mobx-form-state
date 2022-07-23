export type Opaque<K, T> = T & { __TYPE__: K };
export type Concrete<Type> = {
  [P in keyof Type]-?: Type[P];
};
export type Maybe<T> = T | undefined;
export type MaybeArray<T> = T | T[];
export type Callback<T = unknown> = () => T;
