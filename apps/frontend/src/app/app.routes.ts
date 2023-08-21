import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: () =>
      import('@v-notes/frontend/auth').then((m) => m.FrontendAuthModule),
  },
];
