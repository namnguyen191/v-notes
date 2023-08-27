import { Route } from '@angular/router';
import { frontendAuthRoutes } from '@v-notes/frontend/auth';
import { authModulePath } from '@v-notes/shared/helpers';

export const appRoutes: Route[] = [
  {
    path: authModulePath,
    children: frontendAuthRoutes,
  },
  {
    path: '**',
    redirectTo: authModulePath,
    pathMatch: 'full',
  },
];
