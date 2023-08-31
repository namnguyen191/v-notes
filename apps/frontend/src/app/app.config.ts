import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { APP_INITIALIZER, ApplicationConfig } from '@angular/core';
import {
  provideRouter,
  withEnabledBlockingInitialNavigation,
} from '@angular/router';
import { AuthService, authInterceptor } from '@v-notes/frontend/auth';
import { Observable, map } from 'rxjs';
import { appRoutes } from './app.routes';

function initializeAppFactory(
  authService: AuthService
): () => Observable<void> {
  return () =>
    authService.fetchCurrentUser().pipe(
      map((user) => {
        console.log('Setting current user...');
        authService.setCurrentUser(user);
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
      deps: [AuthService],
    },
  ],
};
