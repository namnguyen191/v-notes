import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { userTokenKey } from '@v-notes/frontend/shared';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token: string | null = localStorage.getItem(userTokenKey);

  request = request.clone({
    setHeaders: {
      Authorization: 'Bearer ' + (token ?? ''),
    },
  });

  return next(request);
};
