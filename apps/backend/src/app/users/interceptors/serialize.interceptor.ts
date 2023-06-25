import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Observable, map } from 'rxjs';

interface ClassConstructor {
  new (...args: unknown[]): object;
}

export function Serialize(dto: ClassConstructor) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: ClassConstructor) {}

  intercept(
    _context: ExecutionContext,
    next: CallHandler<unknown>
  ): Observable<unknown> | Promise<Observable<unknown>> {
    return next.handle().pipe(
      map((data) => {
        return plainToClass(this.dto, data, { excludeExtraneousValues: true });
      })
    );
  }
}
