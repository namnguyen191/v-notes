declare const brand: unique symbol;

export type Brand<T, TBrand> = T & { [brand]: TBrand };

export type RoutesFromPath<
  TPaths extends Record<string, string>,
  TRoute extends string
> = {
  [k in keyof TPaths]: `/${TRoute}/${TPaths[k]}`;
};
