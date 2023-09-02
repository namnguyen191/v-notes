import { S } from 'ts-toolbelt';

declare const brand: unique symbol;

export type Brand<T, TBrand> = T & { [brand]: TBrand };

export type ExtractParamsFromRoute<
  TRoute extends string,
  TParamVal extends string
> = {
  [K in S.Split<TRoute, '/'>[number] as K extends `:${infer TParam}`
    ? TParam
    : never]: TParamVal;
};

type RouteFromParamsMap<
  TRoute extends string,
  TParams extends Record<string, string>
> = TRoute extends `${string}:${infer TParam}/${string}`
  ? RouteFromParamsMap<
      S.Replace<TRoute, `:${TParam}`, TParams[TParam]>,
      TParams
    >
  : TRoute extends `${string}:${infer TParam}`
  ? S.Replace<TRoute, `:${TParam}`, TParams[TParam]>
  : TRoute;

export type RoutesFromPath<
  TPaths extends Record<string, string>,
  TRoute extends string
> = {
  [k in keyof TPaths]: TPaths[k] extends `${string}:${string}`
    ? <
        TParamsValue extends string,
        TParams extends ExtractParamsFromRoute<TPaths[k], TParamsValue>
      >(
        params: TParams
      ) => RouteFromParamsMap<TPaths[k], TParams>
    : `/${TRoute}/${TPaths[k]}`;
};
