import { Route } from '@angular/router';
import { authModulePath } from '@v-notes/frontend/auth';

export const appRoutes: Route[] = [
  {
    path: authModulePath,
    loadChildren: () =>
      import('@v-notes/frontend/auth').then((m) => m.FrontendAuthModule),
  },
];
