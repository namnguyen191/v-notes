import { Route } from '@angular/router';
import { authModulePath } from '@v-notes/shared/helpers';

export const frontendCoreRoutes: Route[] = [
  {
    path: authModulePath,
    loadChildren: () =>
      import('@v-notes/frontend/auth').then((m) => m.FrontendAuthModule),
  },
  {
    path: '**',
    redirectTo: authModulePath,
    pathMatch: 'full',
  },
];
