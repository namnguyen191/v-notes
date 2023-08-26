import { Route } from '@angular/router';
import { generateRoutesFromPaths } from '@v-notes/shared/helpers';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

export const authModulePath = 'auth';

const paths = {
  login: 'login',
  register: 'register',
} as const;

export const authRoutes = generateRoutesFromPaths(paths, authModulePath);

export const frontendAuthRoutes: Route[] = [
  {
    path: paths.login,
    component: LoginComponent,
  },
  {
    path: paths.register,
    component: RegisterComponent,
  },
  {
    path: '**',
    redirectTo: paths.login,
    pathMatch: 'full',
  },
];
