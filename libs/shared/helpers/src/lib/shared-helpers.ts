import { ClassConstructor, plainToClass } from 'class-transformer';
import { RoutesFromPath } from '..';

export function serialize<T>(data: unknown, dto: ClassConstructor<T>): T {
  return plainToClass(dto, data, { excludeExtraneousValues: true });
}

export const generateRoutesFromPaths = <
  TPaths extends Record<string, string>,
  TModulePath extends string
>(
  paths: TPaths,
  modulePath: TModulePath
): RoutesFromPath<TPaths, TModulePath> => {
  return Object.entries(paths).reduce(
    (acc, [key, val]) => ({ ...acc, [key]: `/${modulePath}/${val}` }),
    {}
  ) as RoutesFromPath<TPaths, TModulePath>;
};
