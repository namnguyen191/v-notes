import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token: string | null = localStorage.getItem('user-token');

  request = request.clone({
    setHeaders: {
      Authorization: 'Bearer ' + (token ?? ''),
    },
  });

  return next(request);
};
