import { Route } from '@angular/router';
import {
  authModulePath,
  generateRoutesFromPaths,
} from '@v-notes/shared/helpers';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';

const paths = {
  login: 'login',
  register: 'register',
} as const;

export const authRoutes = generateRoutesFromPaths(paths, authModulePath);

export const frontendAuthRoutes: Route[] = [
  {
    path: paths.login,
    component: LoginComponent,
    title: 'Login',
  },
  {
    path: paths.register,
    component: RegisterComponent,
    title: 'Register',
  },
  {
    path: '**',
    redirectTo: paths.login,
    pathMatch: 'full',
  },
];
