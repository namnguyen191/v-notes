import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { AuthService, authInterceptor } from '@v-notes/frontend/auth';
import { SocketService } from '@v-notes/frontend/shared';
import { EMPTY, Observable, catchError, map } from 'rxjs';
import { appRoutes } from './app.routes';

function initializeAppFactory(
  authService: AuthService,
  socketService: SocketService
): () => Observable<void> {
  return () =>
    authService.fetchCurrentUser().pipe(
      map((user) => {
        authService.setCurrentUser(user);
        const token = authService.getToken();
        if (!token) {
          throw new Error('failed to get token to setup socket connection');
        }
        socketService.setupSocketConnection(token);
      }),
      catchError(() => {
        authService.setCurrentUser(null);
        return EMPTY;
      })
    );
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(appRoutes, withEnabledBlockingInitialNavigation()),
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppFactory,
      multi: true,
      deps: [AuthService, SocketService],
    },
    provideAnimations(),
  ],
};
