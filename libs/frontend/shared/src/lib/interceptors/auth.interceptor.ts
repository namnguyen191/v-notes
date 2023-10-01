import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { userTokenKey } from '../constants/local-storage-keys';

export const authInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const token: string | null = localStorage.getItem(userTokenKey);

  request = request.clone({
    setHeaders: {
      Authorization: 'Bearer ' + (token ?? '')
    }
  });

  return next(request);
};
