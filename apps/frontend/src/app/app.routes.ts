import { Route } from '@angular/router';
import { authGuard, frontendAuthRoutes } from '@v-notes/frontend/auth';
import { authModulePath } from '@v-notes/frontend/shared';

export const appRoutes: Route[] = [
  {
    path: authModulePath,
    children: frontendAuthRoutes,
  },
  {
    path: 'board',
    loadChildren: () =>
      import('@v-notes/frontend/board').then((m) => m.frontendBoardRoutes),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: authModulePath,
    pathMatch: 'full',
  },
];
