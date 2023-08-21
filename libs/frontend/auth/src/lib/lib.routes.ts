import { Route } from '@angular/router';
import { LoginComponent } from './components/login/login.component';

export const frontendAuthRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent,
  },
];
