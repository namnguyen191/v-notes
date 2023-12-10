import { Route } from '@angular/router';
import { frontendAuthRoutes } from '@v-notes/frontend/auth';
import {
  authGuard,
  authModulePath,
  boardModulePath
} from '@v-notes/frontend/shared';

export const appRoutes: Route[] = [
  {
    path: authModulePath,
    children: frontendAuthRoutes
  },
  {
    path: boardModulePath,
    loadChildren: () =>
      import('@v-notes/frontend/board').then((m) => m.frontendBoardRoutes),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: authModulePath,
    pathMatch: 'full'
  }
];
