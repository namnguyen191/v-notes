import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: '',
    loadChildren: () =>
      import('@v-notes/frontend/core').then((m) => m.FrontendCoreModule),
  },
];
