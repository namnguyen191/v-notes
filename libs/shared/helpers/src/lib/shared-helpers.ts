import { ClassConstructor, plainToClass } from 'class-transformer';

export function serialize<T>(data: unknown, dto: ClassConstructor<T>): T {
  return plainToClass(dto, data, { excludeExtraneousValues: true });
}
